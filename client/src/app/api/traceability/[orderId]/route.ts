import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";

// CRITICAL: Force dynamic rendering — prevents Next.js from caching stale order status
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDb();
        const { orderId } = await params;

        if (!orderId) {
            return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
        }

        let order;
        // Check if it's a valid 24-char MongoDB ID or a Batch Number
        if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
            // Priority 1: Direct ID Match
            order = await Order.findById(orderId)
                .populate("items.product")
                .populate("user", "name")
                .populate("assignedDeliveryBoy", "name mobile");
        } else {
            // Priority 2: Batch Number Search (Case-insensitive)
            // Escape regex characters
            const escapedBatchId = orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            order = await Order.findOne({
                batchNumber: { $regex: new RegExp(`^${escapedBatchId}$`, "i") }
            })
                .populate("items.product")
                .populate("user", "name")
                .populate("assignedDeliveryBoy", "name mobile");
        }

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Lazy Persistence: If an old order is missing a batch number, 
        // save it now to trigger the pre-save hook and persist it permanently.
        if (!order.batchNumber) {
            try {
                // This will trigger the pre("save") hook in order.model.ts
                await order.save();
                console.log(`Successfully assigned permanent batch number to legacy order: ${order._id}`);
            } catch (saveError) {
                console.error("Failed to auto-persist batch number:", saveError);
            }
        }

        return NextResponse.json(order, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
            }
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

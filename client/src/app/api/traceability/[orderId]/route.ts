import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import DeliveryAssignment from "@/models/deliveryAssignment.model";

// CRITICAL: Ensure all models are registered in the Mongoose instance
// This prevents "Schema not found" errors during population in edge cases
const _ = { Order, Product, User, DeliveryAssignment };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDb();
        const rawParams = await params;
        const orderId = rawParams?.orderId?.trim();

        if (!orderId) {
            return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
        }

        let order;
        // Check if it's a valid 24-char MongoDB ID or a Batch Number
        if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
            // Priority 1: Direct ID Match
            order = await Order.findById(orderId)
                .populate("items.product")
                .populate("user", "name email image")
                .populate("assignedDeliveryBoy", "name mobile");
        } else {
            // Priority 2: Batch Number Search (Case-insensitive)
            const escapedBatchId = orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            order = await Order.findOne({
                batchNumber: { $regex: new RegExp(`^${escapedBatchId}$`, "i") }
            })
                .populate("items.product")
                .populate("user", "name email image")
                .populate("assignedDeliveryBoy", "name mobile");
        }

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Lazy Persistence for legacy orders
        if (!order.batchNumber) {
            try {
                await order.save();
            } catch (saveError) {
                console.error("Non-blocking save error:", saveError);
            }
        }

        return NextResponse.json(order, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
            }
        });
    } catch (error: any) {
        console.error("TRACEABILITY_API_ERROR:", error);
        return NextResponse.json({
            message: "Failed to fetch traceability data",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

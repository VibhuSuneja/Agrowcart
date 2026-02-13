import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";

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
                .populate("user", "name");
        } else {
            // Priority 2: Batch Number Search (Case-insensitive)
            // Escape regex characters
            const escapedBatchId = orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            order = await Order.findOne({
                batchNumber: { $regex: new RegExp(`^${escapedBatchId}$`, "i") }
            })
                .populate("items.product")
                .populate("user", "name");
        }

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

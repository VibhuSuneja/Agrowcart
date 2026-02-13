import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDb();
        const { orderId } = await params;

        let order;
        // Check if it's a valid MongoDB ID or a Batch Number
        if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(orderId).populate("items.product").populate("user", "name");
        } else {
            // Case-insensitive search for batch number
            order = await Order.findOne({
                batchNumber: { $regex: new RegExp(`^${orderId}$`, "i") }
            }).populate("items.product").populate("user", "name");
        }

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

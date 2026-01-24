import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDb();
        const { orderId } = await params;

        const order = await Order.findById(orderId).populate("items.product");

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

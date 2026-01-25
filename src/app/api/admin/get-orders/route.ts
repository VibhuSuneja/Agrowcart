import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const orders = await Order.find({}).populate("user assignedDeliveryBoy").sort({ createdAt: -1 })
        return NextResponse.json(
            orders, { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `get orders error: ${error}` }, { status: 500 }
        )
    }
}
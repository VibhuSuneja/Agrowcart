import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        const deliveryBoyId = session?.user?.id;

        if (!deliveryBoyId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const orders = await Order.find({
            assignedDeliveryBoy: deliveryBoyId,
            status: "delivered"
        });

        const today = new Date().toDateString();
        const todayOrders = orders.filter((o: any) =>
            o.deliveredAt && new Date(o.deliveredAt).toDateString() === today
        ).length;

        const totalEarnings = orders.length * 40;
        const todaysEarnings = todayOrders * 40;

        return NextResponse.json({
            earnings: todaysEarnings,
            totalEarnings: totalEarnings,
            deliveries: todayOrders,
            totalDeliveries: orders.length
        }, { status: 200 });

    } catch (error) {
        console.error("Stats API error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

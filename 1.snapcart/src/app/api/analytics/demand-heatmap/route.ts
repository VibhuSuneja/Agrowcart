import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();

        if (session?.user?.role !== "farmer" && session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Aggregate orders by city to show demand
        const demandData = await Order.aggregate([
            {
                $group: {
                    _id: "$address.city",
                    orderCount: { $sum: 1 },
                    totalVolume: { $sum: 1 }, // Simplification: 1 unit per order for this visualization
                    labels: { $first: "$address.city" }
                }
            },
            { $sort: { orderCount: -1 } },
            { $limit: 10 }
        ]);

        return NextResponse.json(demandData);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb();

        // Find orders where batchNumber is missing or null
        const orders = await Order.find({
            $or: [
                { batchNumber: { $exists: false } },
                { batchNumber: null },
                { batchNumber: "" }
            ]
        });

        let updatedCount = 0;
        const results = [];

        for (const order of orders) {
            const random = Math.floor(100000 + Math.random() * 900000);
            order.batchNumber = `BATCH-${random}`;

            try {
                await order.save();
                updatedCount++;
                results.push({ orderId: order._id, batchNumber: order.batchNumber });
            } catch (err) {
                console.error(`Failed to update order ${order._id}:`, err);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Migration complete. Updated ${updatedCount} orders.`,
            updatedCount,
            totalFound: orders.length,
            sample: results.slice(0, 5)
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Migration failed",
            error: error.message
        }, { status: 500 });
    }
}

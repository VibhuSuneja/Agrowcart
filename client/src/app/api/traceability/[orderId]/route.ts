import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import mongoose from "mongoose";

// Robust model registration
const models = { Order, Product, User, DeliveryAssignment };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    console.log("TRACEABILITY_API_INVOKED");
    try {
        try {
            await connectDb();
            console.log("TRACEABILITY_DB_OK");
        } catch (dbErr: any) {
            console.error("TRACEABILITY_DB_FAIL:", dbErr.message);
            throw new Error(`Database connection failed: ${dbErr.message}`);
        }

        const rawParams = await params;
        const orderId = rawParams?.orderId?.trim();

        if (!orderId) {
            return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
        }

        const isValidId = mongoose.Types.ObjectId.isValid(orderId);
        let query;

        if (isValidId) {
            query = Order.findById(orderId);
        } else {
            const escapedBatchId = orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query = Order.findOne({
                batchNumber: { $regex: new RegExp(`^${escapedBatchId}$`, "i") }
            });
        }

        console.log("EXECUTING_TRACEABILITY_QUERY:", { orderId, isValidId });

        // Force register models in current context (safety)
        const __reg = [Order, Product, User, DeliveryAssignment];

        let order;
        try {
            order = await query
                .populate({ path: "items.product", model: Product })
                .populate({ path: "user", model: User, select: "name email image" })
                .populate({ path: "assignedDeliveryBoy", model: User, select: "name mobile" })
                .lean()
                .exec();
            console.log("QUERY_EXEC_OK", order ? "Found" : "Null");
        } catch (queryErr: any) {
            console.error("QUERY_OR_POPULATE_FAIL:", queryErr.message);
            throw new Error(`Query/Populate failed: ${queryErr.message}`);
        }

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Lazy Persistence for legacy orders (using updateOne)
        if (!(order as any).batchNumber) {
            try {
                const random = Math.floor(100000 + Math.random() * 900000);
                const generatedBatch = `BATCH-${random}`;
                await Order.updateOne({ _id: (order as any)._id }, { batchNumber: generatedBatch });
                (order as any).batchNumber = generatedBatch;
            } catch (saveError: any) {
                console.error("BATCH_GEN_ERROR:", saveError.message);
            }
        }

        // Extremely safe serialization
        const safeData = JSON.parse(JSON.stringify(order));

        return NextResponse.json(safeData, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
            }
        });
    } catch (error: any) {
        console.error("TRACEABILITY_CRITICAL_FAILURE:", {
            msg: error.message,
            stack: error.stack
        });

        return NextResponse.json({
            message: "Traceability API Failure",
            error: error.message,
        }, { status: 500 });
    }
}

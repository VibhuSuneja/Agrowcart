import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import mongoose from "mongoose";

// FORCE REGISTER MODELS - Critical for Next.js Route Handlers to prevent "Schema not found"
const modelRegistry = { Order, User, Product, DeliveryAssignment };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    console.log("[TRACEABILITY_API] Start Execution");

    try {
        // 1. Connect to Database with specific check
        try {
            await connectDb();
            console.log("[TRACEABILITY_API] Database Connected");
        } catch (dbError: any) {
            console.error("[TRACEABILITY_API] DB Connection Failure:", dbError.message);
            return NextResponse.json({ message: "Database connection failed", error: dbError.message }, { status: 500 });
        }

        // 2. Resolve Parameters
        const resolvedParams = await params;
        const orderId = resolvedParams?.orderId?.trim();

        if (!orderId) {
            return NextResponse.json({ message: "Order ID is missing from request" }, { status: 400 });
        }

        // 3. Ensure Models are ready in this context
        // This is a safety loop to ensure Mongoose hasn't "lost" the models due to hot-reloading
        Object.entries(modelRegistry).forEach(([name, model]) => {
            if (!mongoose.models[name]) {
                mongoose.model(name, (model as any).schema);
            }
        });

        // 4. Resolve Query (Direct ID or Batch Number)
        const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
        let orderQuery;

        if (isObjectId) {
            console.log("[TRACEABILITY_API] Searching by ObjectID:", orderId);
            orderQuery = Order.findById(orderId);
        } else {
            console.log("[TRACEABILITY_API] Searching by Batch Number:", orderId);
            // Case-insensitive regex match for the batch number
            const escapedId = orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            orderQuery = Order.findOne({ batchNumber: { $regex: new RegExp(`^${escapedId}$`, "i") } });
        }

        // 5. Execute with Population and .lean() for serialization safety
        let orderData: any;
        try {
            orderData = await orderQuery
                .populate({ path: "user", model: User, select: "name email image" })
                .populate({ path: "items.product", model: Product })
                .populate({ path: "assignedDeliveryBoy", model: User, select: "name mobile" })
                .lean()
                .exec();

            console.log("[TRACEABILITY_API] Query executed successfully:", orderData ? "Record Found" : "No Record");
        } catch (queryError: any) {
            console.error("[TRACEABILITY_API] Query/Populate Failure:", queryError.message);
            return NextResponse.json({ message: "Query processing failed", error: queryError.message }, { status: 500 });
        }

        if (!orderData) {
            return NextResponse.json({ message: "Order not found in data-store" }, { status: 404 });
        }

        // 6. Handle Legacy Batch Registration
        // If an order exists but has no batch number, we auto-generate it (lazy migration)
        if (!orderData.batchNumber) {
            try {
                const generatedBatch = `BATCH-${Math.floor(100000 + Math.random() * 900000)}`;
                await Order.updateOne({ _id: orderData._id }, { $set: { batchNumber: generatedBatch } });
                orderData.batchNumber = generatedBatch;
                console.log("[TRACEABILITY_API] Legacy Batch migrated:", generatedBatch);
            } catch (migrateErr: any) {
                console.warn("[TRACEABILITY_API] Batch migration failed (non-blocking):", migrateErr.message);
            }
        }

        // 7. Success Response with strict serialization
        const serialized = JSON.parse(JSON.stringify(orderData));

        return NextResponse.json(serialized, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });

    } catch (criticalError: any) {
        console.error("[TRACEABILITY_API] CRIT_FAIL:", {
            error: criticalError.message,
            stack: criticalError.stack
        });

        return NextResponse.json({
            message: "A critical error occurred in the traceability engine",
            error: criticalError.message
        }, { status: 500 });
    }
}

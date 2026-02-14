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
    try {
        await connectDb();

        // Ensure models are registered in the current connection's model cache
        // This is a safety measure for serverless environments
        if (mongoose.connection.readyState === 1) {
            Object.values(models).forEach(m => {
                if (m.modelName && !mongoose.models[m.modelName]) {
                    mongoose.model(m.modelName, m.schema);
                }
            });
        }

        const rawParams = await params;
        const orderId = rawParams?.orderId?.trim();

        if (!orderId) {
            return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
        }

        let order;
        // Accurate check for MongoDB ObjectId
        const isValidId = mongoose.Types.ObjectId.isValid(orderId);

        if (isValidId) {
            // Priority 1: Direct ID Match
            order = await Order.findById(orderId)
                .populate({
                    path: "items.product",
                    model: "Product"
                })
                .populate({
                    path: "user",
                    model: "User",
                    select: "name email image"
                })
                .populate({
                    path: "assignedDeliveryBoy",
                    model: "User",
                    select: "name mobile"
                });
        } else {
            // Priority 2: Batch Number Search (Case-insensitive)
            const escapedBatchId = orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            order = await Order.findOne({
                batchNumber: { $regex: new RegExp(`^${escapedBatchId}$`, "i") }
            })
                .populate({
                    path: "items.product",
                    model: "Product"
                })
                .populate({
                    path: "user",
                    model: "User",
                    select: "name email image"
                })
                .populate({
                    path: "assignedDeliveryBoy",
                    model: "User",
                    select: "name mobile"
                });
        }

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Lazy Persistence for legacy orders (using updateOne to avoid validation issues)
        if (!order.batchNumber) {
            try {
                const random = Math.floor(100000 + Math.random() * 900000);
                await Order.updateOne({ _id: order._id }, { batchNumber: `BATCH-${random}` });
                order.batchNumber = `BATCH-${random}`; // Sync local object
            } catch (saveError) {
                console.error("Non-blocking update error:", saveError);
            }
        }

        return NextResponse.json(order, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
            }
        });
    } catch (error: any) {
        console.error("TRACEABILITY_API_ERROR_STRICT:", error);
        return NextResponse.json({
            message: "Failed to fetch traceability data",
            error: error?.message || "Unknown server error",
            details: process.env.NODE_ENV === 'development' ? error : undefined
        }, { status: 500 });
    }
}

import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Product from "@/models/product.model";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ orderId: string; }>; }) {
    try {
        await connectDb()
        const { orderId } = await context.params
        const { status } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json(
                { message: "order not found" },
                { status: 400 }
            )
        }
        const previousStatus = order.status;
        order.status = status;

        // Handle Cancellation - Return stock & Process Refund
        if (status === "cancelled" && previousStatus !== "cancelled") {
            // Return items to stock
            for (const item of order.items) {
                if (item.product) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: item.quantity }
                    });
                }
            }

            // Cancel any active delivery assignments
            if (order.assignment) {
                await DeliveryAssignment.findByIdAndUpdate(order.assignment, {
                    status: "cancelled"
                });
            }

            // Process Refund — credit to user wallet
            order.cancelledAt = new Date();
            const refundAmount = order.totalAmount || 0;
            if (refundAmount > 0) {
                // Credit wallet balance
                await User.findByIdAndUpdate(order.user._id || order.user, {
                    $inc: { walletBalance: refundAmount }
                });

                order.status = "refunded";
                order.refundedAt = new Date();
                order.cancellationReason = `Order cancelled by admin. ₹${refundAmount} refunded to wallet.`;

                // Send Refund Email
                try {
                    const customer = order.user;
                    if (customer?.email) {
                        const { sendEmail } = await import("@/lib/email");
                        await sendEmail({
                            to: customer.email,
                            subject: `AgrowCart — Refund of ₹${refundAmount} Processed`,
                            html: `
                                <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; border-radius: 24px; overflow: hidden;">
                                    <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">Refund Processed ✅</h1>
                                        <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your money is safe with AgrowCart</p>
                                    </div>
                                    <div style="padding: 30px;">
                                        <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${customer.name || 'Valued Customer'}</strong>,</p>
                                        <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">Your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been cancelled and a refund has been processed.</p>
                                        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 24px; margin: 24px 0; text-align: center;">
                                            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #71717a; font-weight: 700;">Refund Amount</div>
                                            <div style="font-size: 36px; font-weight: 900; color: #4ade80; margin: 8px 0;">₹${refundAmount}</div>
                                            <div style="font-size: 12px; color: #a1a1aa;">Credited to your <strong>AgrowCart Wallet</strong></div>
                                        </div>
                                        <p style="font-size: 13px; color: #71717a; line-height: 1.6;">You can use your wallet balance on your next purchase. The balance is available immediately.</p>
                                        <a href="https://www.agrowcart.com" style="display: block; text-align: center; background: #16a34a; color: white; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 24px;">Shop Again →</a>
                                    </div>
                                    <div style="padding: 20px 30px; text-align: center; border-top: 1px solid #222;">
                                        <p style="font-size: 11px; color: #52525b; margin: 0;">AgrowCart — India's Sustainable Millet Marketplace</p>
                                    </div>
                                </div>
                            `
                        });
                    }
                } catch (emailErr) {
                    console.error("Refund email failed:", emailErr);
                }
            }
        }

        let deliveryBoysPayload: any = []
        if (status === "out of delivery" && !order.assignment) {
            const { latitude, longitude } = order.address
            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: 10000
                    }
                }
            })
            const nearByIds = nearByDeliveryBoys.map((b) => b._id)
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["brodcasted", "completed"] }
            }).distinct("assignedTo")
            const busyIdSet = new Set(busyIds.map(b => String(b)))
            const availableDeliveryBoys = nearByDeliveryBoys.filter(
                b => !busyIdSet.has(String(b._id))
            )
            const candidates = availableDeliveryBoys.map(b => b._id)

            if (candidates.length == 0) {
                await order.save()

                await emitEventHandler("order-status-update", { orderId: order._id, status: order.status })

                return NextResponse.json(
                    { message: "there is no available Delivery boys" },
                    { status: 200 }
                )
            }

            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                brodcastedTo: candidates,
                status: "brodcasted"
            })

            await deliveryAssignment.populate("order");
            for (const boyId of candidates) {
                await emitEventHandler("new-assignment", deliveryAssignment, undefined, `user:${boyId}`)
            }


            order.assignment = deliveryAssignment._id
            deliveryBoysPayload = availableDeliveryBoys.map(b => ({
                id: b._id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location.coordinates[1],
                longitude: b.location.coordinates[0]
            }))
            await deliveryAssignment.populate("order")

        }

        await order.save()
        await order.populate("user")
        await emitEventHandler("order-status-update", { orderId: order._id, status: order.status })
        return NextResponse.json({
            assignment: order.assignment?._id,
            availableBoys: deliveryBoysPayload
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: `update status error ${error}`
        }, { status: 500 })
    }
}
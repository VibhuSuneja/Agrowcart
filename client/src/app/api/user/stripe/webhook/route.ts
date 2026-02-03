import connectDb from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature")
    const rawBody = await req.text()
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        console.error("signature verification failed", error)
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    if (event?.type === "checkout.session.completed") {
        const session = event.data.object
        await connectDb()

        const order = await Order.findByIdAndUpdate(
            session?.metadata?.orderId,
            { isPaid: true },
            { new: true }
        ).populate('user')

        // Send order confirmation email after successful payment
        if (order && order.user?.email) {
            sendOrderConfirmation(order.user.email, {
                customerName: order.user.name || order.address?.fullName || 'Valued Customer',
                orderId: order._id.toString(),
                items: order.items.map((item: any) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: order.totalAmount,
                address: order.address?.fullAddress || `${order.address?.city}, ${order.address?.state}`,
                paymentMethod: 'online'
            }).catch(err => console.error('Email sending failed:', err))
        }
    }

    return NextResponse.json({ recieved: true }, { status: 200 })

}

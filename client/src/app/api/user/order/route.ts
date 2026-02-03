import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import { sendOrderConfirmation } from "@/lib/email";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { userId, items, paymentMethod, totalAmount, address } = await req.json()
        if (!items || !userId || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json(
                { message: "please send all credentials" },
                { status: 400 }
            )
        }
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 400 }
            )
        }

        const newOrder = await Order.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })


        await emitEventHandler("new-order", newOrder)

        // Send order confirmation email (async, don't block response)
        if (user.email) {
            sendOrderConfirmation(user.email, {
                customerName: user.name || address.fullName || 'Valued Customer',
                orderId: newOrder._id.toString(),
                items: items.map((item: any) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalAmount,
                address: address.fullAddress || `${address.city}, ${address.state} - ${address.pincode}`,
                paymentMethod: paymentMethod
            }).catch(err => console.error('Email sending failed:', err))
        }

        return NextResponse.json(
            newOrder,
            { status: 201 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `place order error ${error}` },
            { status: 500 }
        )
    }
}

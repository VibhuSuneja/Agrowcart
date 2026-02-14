import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import { sendOrderConfirmation } from "@/lib/email";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
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

        // Check and update stock
        for (const item of items) {
            const product = await Product.findById(item.product || item.grocery || item._id)
            if (product && product.stock !== undefined && product.stock !== null) {
                if (product.stock < item.quantity) {
                    return NextResponse.json(
                        { message: `Insufficient stock for ${product.name}` },
                        { status: 400 }
                    )
                }
                // Decrement stock
                product.stock -= item.quantity
                await product.save()
            }
        }

        const newOrder = await Order.create({
            user: userId,
            items: items.map((item: any) => ({
                product: item.product || item.grocery || item._id,
                name: item.name,
                price: item.price,
                unit: item.unit,
                image: item.image,
                quantity: item.quantity
            })),
            paymentMethod,
            totalAmount,
            address
        })


        await emitEventHandler("new-order", newOrder, undefined, "admin")

        // Send order confirmation email
        if (user.email) {
            try {
                await sendOrderConfirmation(user.email, {
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
                });
                console.log('Order confirmation email sent successfully');
            } catch (err) {
                console.error('Email sending failed:', err);
            }
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

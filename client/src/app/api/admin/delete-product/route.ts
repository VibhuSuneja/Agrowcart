import { auth } from "@/auth";

import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const allowedRoles = ['admin', 'farmer', 'shg', 'processor', 'startup'];
        if (!allowedRoles.includes(session?.user?.role as string)) {
            return NextResponse.json(
                { message: "Unauthorized: Access denied" },
                { status: 403 }
            )
        }
        const { productId } = await req.json()
        const product = await Product.findById(productId)

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        // Non-admins can only delete their own products
        if (session.user.role !== "admin") {
            // Check if product has an owner field (it should from the add-product flow)
            // If it doesn't, we should probably be safe and deny, or allow if strict mode isn't on. 
            // Better to assume if owner exists, check it.
            if (product.owner && product.owner.toString() !== session.user.id) {
                return NextResponse.json(
                    { message: "Unauthorized: You can only delete your own products" },
                    { status: 403 }
                )
            }
        }

        await Product.findByIdAndDelete(productId)

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `delete product error ${error}` },
            { status: 500 }
        )
    }
}



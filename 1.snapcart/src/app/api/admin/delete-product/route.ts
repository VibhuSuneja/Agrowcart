import { auth } from "@/auth";

import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (session?.user?.role !== "admin" && session?.user?.role !== "farmer") {
            return NextResponse.json(
                { message: "Unauthorized: Admin or Farmer role required" },
                { status: 403 }
            )
        }
        const { productId } = await req.json()
        const product = await Product.findById(productId)

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        if (session.user.role === "farmer") {
            // Farmers can only delete products they own
            if (!product.owner || product.owner.toString() !== session.user.id) {
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



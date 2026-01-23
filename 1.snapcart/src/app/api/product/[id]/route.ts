import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb()
        const { id } = await params
        const product = await Product.findById(id)
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }
        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()

        // Public marketplace access
        const products = await Product.find({}).populate("owner", "name role").sort({ createdAt: -1 });
        return NextResponse.json(products, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `Failed to fetch products: ${error}` }, { status: 500 })
    }
}

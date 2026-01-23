import { auth } from "@/auth";

import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (session?.user?.role !== "admin") {
            return NextResponse.json(
                { message: "you are not admin" },
                { status: 400 }
            )
        }
        const { productId } = await req.json()
        const product = await Product.findByIdAndDelete(productId)
        return NextResponse.json(
            product,
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `delete product error ${error}` },
            { status: 500 }
        )
    }
}



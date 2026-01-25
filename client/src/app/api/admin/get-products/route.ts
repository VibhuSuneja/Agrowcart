import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb()
    const session = await auth()
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const products = await Product.find({})
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: `get products error ${error}` }, { status: 500 })
  }
}
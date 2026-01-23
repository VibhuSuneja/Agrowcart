import Product from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await Product.find({})
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: `get products error ${error}` }, { status: 200 })
  }
}
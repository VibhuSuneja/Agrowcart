import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
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
        const formData = await req.formData()
        const name = formData.get("name") as string
        const category = formData.get("category") as string
        const unit = formData.get("unit") as string
        const price = formData.get("price") as string
        const stock = formData.get("stock") as string
        const file = formData.get("image") as Blob | null

        let imageUrl = null
        if (file) {
            try {
                console.log("Attempting Cloudinary upload for product:", name)
                imageUrl = await uploadOnCloudinary(file)
                if (!imageUrl) {
                    console.warn("Cloudinary upload returned null, proceeding without image")
                }
            } catch (uploadError) {
                console.error("Cloudinary upload failed:", uploadError)
                // Continue without image rather than failing entire product creation
            }
        }

        const product = await Product.create({
            name, price, category, unit, image: imageUrl, stock: stock ? Number(stock) : null
        })

        console.log("Product created successfully:", product._id)

        return NextResponse.json(
            product,
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Add product error:", error)
        console.error("Error stack:", error.stack)
        return NextResponse.json(
            { message: `add product error: ${error.message || error}` },
            { status: 500 }
        )
    }
}
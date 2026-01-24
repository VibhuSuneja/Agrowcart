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
        const productId = formData.get("productId") as string
        const category = formData.get("category") as string
        const unit = formData.get("unit") as string
        const price = formData.get("price") as string
        const scientificBenefits = formData.get("scientificBenefits") as string
        const file = formData.get("image") as Blob | null

        // Prepare update object
        const updateData: any = {
            name,
            price,
            category,
            unit,
            scientificBenefits
        }

        // Only update image if a new one is provided
        if (file && file.size > 0) {
            const imageUrl = await uploadOnCloudinary(file)
            updateData.image = imageUrl
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true } // Return updated document
        )

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: true, product },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `edit product error ${error}` },
            { status: 500 }
        )
    }
}



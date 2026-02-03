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
        const productId = formData.get("productId") as string
        const name = formData.get("name") as string
        const category = formData.get("category") as string
        const unit = formData.get("unit") as string
        const price = formData.get("price") as string
        const scientificBenefits = formData.get("scientificBenefits") as string
        const fssaiLicense = formData.get("fssaiLicense") as string
        const isCompliant = formData.get("isCompliant") === "true"
        const originState = formData.get("originState") as string
        const originCity = formData.get("originCity") as string
        const stock = formData.get("stock") as string
        const file = formData.get("image") as Blob | null

        const product = await Product.findById(productId)
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        product.name = name;
        product.price = price;
        product.category = category;
        product.unit = unit;
        product.scientificBenefits = scientificBenefits;
        product.fssaiLicense = fssaiLicense;
        product.isCompliant = isCompliant;
        product.originState = originState;
        product.originCity = originCity;
        product.stock = stock ? Number(stock) : 0;

        if (file && file.size > 0) {
            const imageUrl = await uploadOnCloudinary(file)
            product.image = imageUrl
        }

        await product.save()

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



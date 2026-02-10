import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        // Check authentication
        const session = await auth();
        if (!session?.user || !["farmer", "shg", "processor", "admin", "startup"].includes(session.user.role)) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const productId = formData.get("productId") as string;
        const name = formData.get("name") as string;
        const quantity = formData.get("quantity") as string;
        const price = formData.get("price") as string;
        const category = formData.get("category") as string;
        const unit = formData.get("unit") as string;
        const fssaiLicense = formData.get("fssaiLicense") as string;
        const originState = formData.get("originState") as string;
        const originCity = formData.get("originCity") as string;
        const imageFile = formData.get("image") as File | null;
        const harvestDate = formData.get("harvestDate") as string;

        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const product = await Product.findOne({ _id: productId, owner: session.user.id });
        if (!product) {
            return NextResponse.json({ message: "Product not found or unauthorized" }, { status: 404 });
        }

        // Update fields
        if (name) product.name = name;
        if (quantity) product.stock = Number(quantity);
        if (price) product.price = price;
        if (category) product.category = category;
        if (unit) product.unit = unit;
        if (fssaiLicense) product.fssaiLicense = fssaiLicense;
        if (originState) product.originState = originState;
        if (originCity) product.originCity = originCity;
        if (harvestDate) product.harvestDate = new Date(harvestDate);

        if (imageFile) {
            const uploadedUrl = await uploadOnCloudinary(imageFile);
            if (uploadedUrl) {
                product.image = uploadedUrl;
            }
        }

        await product.save();

        return NextResponse.json(
            { message: "Product updated successfully", product },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update Farmer Product Error:", error);
        return NextResponse.json(
            { message: `Failed to update product: ${error.message}` },
            { status: 500 }
        );
    }
}

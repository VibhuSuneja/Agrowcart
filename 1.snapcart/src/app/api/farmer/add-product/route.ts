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
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const quantity = formData.get("quantity") as string;
        const price = formData.get("price") as string;
        const category = formData.get("category") as string;
        const unit = formData.get("unit") as string;
        const farmId = formData.get("farmId") as string;
        const harvestDate = formData.get("harvestDate") as string;
        const imageFile = formData.get("image") as File | null;

        // Validate required fields
        if (!name || !quantity || !price) {
            return NextResponse.json(
                { message: "Name, volume, and price are required" },
                { status: 400 }
            );
        }

        let imageUrl = "https://placehold.co/300?text=Millet";
        if (imageFile) {
            const uploadedUrl = await uploadOnCloudinary(imageFile);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }

        // Create product
        const product = await Product.create({
            name,
            category: category || "Raw Millets",
            price,
            unit: unit || "kg",
            image: imageUrl,
            farmId: farmId || session.user.id,
            harvestDate,
            priceAI: price // Store farmer's price as AI price for now
        });

        return NextResponse.json(
            { message: "Product added successfully", product },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Add Farmer Product Error:", error);
        return NextResponse.json(
            { message: `Failed to add product: ${error.message}` },
            { status: 500 }
        );
    }
}

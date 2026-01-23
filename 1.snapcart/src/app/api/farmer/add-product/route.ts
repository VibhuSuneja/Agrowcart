import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

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

        const { name, quantity, price, category, unit } = await req.json();

        // Validate required fields
        if (!name || !quantity || !price) {
            return NextResponse.json(
                { message: "Name, quantity, and price are required" },
                { status: 400 }
            );
        }

        // Create product
        const product = await Product.create({
            name,
            category: category || "Millets",
            price,
            unit: unit || "kg",
            image: "https://via.placeholder.com/300?text=Millet", // Default placeholder
            farmId: session.user.id,
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

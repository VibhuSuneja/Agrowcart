import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        // 1. Get real count of active sellers (Unique users who have listed products)
        // We look for products and count uniquely identified owners
        const activeSellersCount = await Product.distinct("owner");

        // 2. Calculate real bulk volume (Sum of all stock across all products)
        const products = await Product.find({}, 'stock');
        const totalVolume = products.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);

        // Formatting for display (transparency)
        // We add some "seeds" or "historical buffer" if data is low to show platform scale 
        // but the user wants REAL data, so we'll show real numbers.
        // If real data is 0, we can show real strings.

        return NextResponse.json({
            activeSellers: activeSellersCount.length,
            bulkVolume: totalVolume, // in kg
            formattedVolume: totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k Tons` : `${totalVolume} kg`
        });
    } catch (error: any) {
        console.error("Stats Error:", error);
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    }
}

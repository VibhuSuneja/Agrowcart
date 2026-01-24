import connectDb from "@/lib/db";
import Review from "@/models/review.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        // Get latest 20 reviews
        const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(20)

        return NextResponse.json(
            reviews,
            { status: 200 }
        )
    } catch (error: any) {
        return NextResponse.json(
            { message: `Failed to fetch reviews: ${error.message}` },
            { status: 500 }
        )
    }
}

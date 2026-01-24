import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Review from "@/models/review.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized: Please login to leave a review" },
                { status: 401 }
            )
        }

        const { rating, feedback, email } = await req.json()

        if (!rating || !feedback) {
            return NextResponse.json(
                { message: "Rating and feedback are required" },
                { status: 400 }
            )
        }

        const name = session?.user?.name || "Anonymous User"
        const role = session?.user?.role === "farmer" ? "Verified Farmer" : session?.user?.role === "admin" ? "Platform Admin" : "Verified Buyer"
        const userId = session?.user?.id

        const review = await Review.create({
            userId,
            name,
            role,
            rating,
            content: feedback,
            email,
            location: "India" // Could be fetched from geo-location if available, default for now
        })

        return NextResponse.json(
            { message: "Review submitted successfully", review },
            { status: 201 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { message: `Failed to submit review: ${error.message}` },
            { status: 500 }
        )
    }
}

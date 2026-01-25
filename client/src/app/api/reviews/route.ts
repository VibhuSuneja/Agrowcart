import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import ProductReview from "@/models/productReview.model";
import Product from "@/models/product.model";
import { auth } from "@/auth";

// GET: Fetch reviews for a product
export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        const reviews = await ProductReview.find({ product: productId })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ success: true, reviews });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Submit a review for a product
export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { product: productId, rating, comment } = await req.json();

        if (!productId || !rating || !comment) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        // Check if user already reviewed this product
        const existingReview = await ProductReview.findOne({
            product: productId,
            user: session.user.id
        });

        if (existingReview) {
            return NextResponse.json({ error: "You already reviewed this product" }, { status: 400 });
        }

        // Create review
        const review = await ProductReview.create({
            product: productId,
            user: session.user.id,
            userName: session.user.name,
            rating,
            comment,
            verified: false // Can be set to true if user purchased the product
        });

        // Update product rating
        const reviews = await ProductReview.find({ product: productId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
            reviewCount: reviews.length
        });

        return NextResponse.json({ success: true, review });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const wishlist = user.wishlist || [];
        const index = wishlist.findIndex((id: mongoose.Types.ObjectId) => id.toString() === productId);

        if (index === -1) {
            // Add to wishlist
            wishlist.push(new mongoose.Types.ObjectId(productId));
        } else {
            // Remove from wishlist
            wishlist.splice(index, 1);
        }

        user.wishlist = wishlist;
        await user.save();

        return NextResponse.json({ success: true, wishlist });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user.id).select("wishlist");
        return NextResponse.json({ success: true, wishlist: user?.wishlist || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

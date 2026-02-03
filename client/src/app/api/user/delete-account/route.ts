import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
    try {
        console.log("Delete account requested");
        await connectDb();
        const session = await auth();

        if (!session?.user?.id) {
            console.log("Delete account failed: Unauthorized (no session id)");
            return NextResponse.json(
                { message: "Unauthorized. Please log in again." },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        console.log(`Processing deletion for user ID: ${userId}`);

        // Check for active orders using robust check
        const activeOrders = await Order.find({
            user: new mongoose.Types.ObjectId(userId),
            status: { $in: ["pending", "confirmed", "out of delivery"] }
        });

        if (activeOrders.length > 0) {
            console.log(`Delete account blocked: user has ${activeOrders.length} active orders`);
            return NextResponse.json(
                { message: `Cannot delete account. You have ${activeOrders.length} active orders. Please wait for delivery or cancel them first.` },
                { status: 400 }
            );
        }

        // Delete user
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            console.log(`Delete account failed: User not found in database for ID ${userId}`);
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        console.log(`Account successfully deleted for user: ${deletedUser.email}`);

        return NextResponse.json(
            { message: "Account deleted successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { message: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}

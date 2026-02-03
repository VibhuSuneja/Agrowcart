import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Check for active orders
        const activeOrders = await Order.find({
            user: userId,
            status: { $nin: ["delivered", "cancelled"] }
        });

        if (activeOrders.length > 0) {
            return NextResponse.json(
                { message: "Cannot delete account with active orders. Please wait for delivery or cancel pending orders." },
                { status: 400 }
            );
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        return NextResponse.json(
            { message: "Account deleted successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { message: `Failed to delete account: ${error.message}` },
            { status: 500 }
        );
    }
}

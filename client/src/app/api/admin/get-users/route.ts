import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const users = await User.find({}).sort({ createdAt: -1 })
        return NextResponse.json(users, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `get users error ${error}` }, { status: 500 })
    }
}

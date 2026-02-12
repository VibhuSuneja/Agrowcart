import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDb()
        const session = await auth()
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const { userId } = await req.json()
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        user.isBanned = !user.isBanned
        await user.save()
        return NextResponse.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successful`, user }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `toggle ban error ${error}` }, { status: 500 })
    }
}

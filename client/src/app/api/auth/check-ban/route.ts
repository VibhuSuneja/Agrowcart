import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDb()
        const { email } = await req.json()
        if (!email) {
            return NextResponse.json({ isBanned: false }, { status: 400 })
        }
        const user = await User.findOne({ email }).select("isBanned")
        if (!user) {
            return NextResponse.json({ isBanned: false }, { status: 404 })
        }
        return NextResponse.json({ isBanned: !!user.isBanned }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ isBanned: false }, { status: 500 })
    }
}

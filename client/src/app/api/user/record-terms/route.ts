import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDb()
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await User.findByIdAndUpdate(session.user.id, {
            agreedToTerms: new Date()
        })

        return NextResponse.json({ message: "Terms accepted" })
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 })
    }
}

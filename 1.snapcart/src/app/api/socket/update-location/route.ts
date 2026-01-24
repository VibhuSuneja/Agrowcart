import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        const { userId, location } = await req.json()

        const internalSecret = req.headers.get('x-internal-secret')
        const isInternal = internalSecret === 'my-secure-interal-secret'

        if (!isInternal && (!session?.user?.id || session.user.id !== userId)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        if (!userId || !location) {
            return NextResponse.json(
                { message: "missing userId or Location" },
                { status: 400 }
            )
        }

        const user = await User.findByIdAndUpdate(userId, { location })
        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "location updated" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `update location error ${error}` },
            { status: 500 }
        )
    }
}
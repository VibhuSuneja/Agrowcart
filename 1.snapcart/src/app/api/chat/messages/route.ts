import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Message from "@/models/message.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { roomId } = await req.json()

        // Authorization check for the room
        if (roomId.startsWith('negotiation:')) {
            const [_, farmerId, buyerId] = roomId.split(':')
            if (session.user.id !== farmerId && session.user.id !== buyerId) {
                return NextResponse.json({ message: "Unauthorized room access" }, { status: 403 })
            }
        }

        const messages = await Message.find({ roomId })


        return NextResponse.json(
            messages, { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `get messages  error ${error}` }, { status: 500 }
        )
    }
}
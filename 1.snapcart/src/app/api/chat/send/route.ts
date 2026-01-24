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

        const { roomId, text, senderId, time } = await req.json()

        // Validate that the sender is the logged-in user
        if (session.user.id !== senderId) {
            return NextResponse.json({ message: "Sender mismatch" }, { status: 403 })
        }

        // Create and save message
        const newMessage = await Message.create({
            roomId,
            text,
            senderId,
            time
        })

        return NextResponse.json({ success: true, message: newMessage }, { status: 201 })
    } catch (error) {
        console.error("Send message error:", error)
        return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
    }
}

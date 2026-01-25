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

        // 1. Strict Sender Verification
        if (session.user.id !== senderId) {
            return NextResponse.json({ message: "Sender mismatch" }, { status: 403 })
        }

        // 2. Room Participant Verification (Security Layer)
        // RoomId format: negotiation:farmerId:buyerId
        const roomParts = roomId.split(':');
        if (roomParts.length < 3) {
            return NextResponse.json({ message: "Invalid room format" }, { status: 400 })
        }

        const participantIds = [roomParts[1], roomParts[2]];
        if (!participantIds.includes(session.user.id)) {
            return NextResponse.json({ message: "Access Denied: You are not a participant in this negotiation." }, { status: 403 })
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

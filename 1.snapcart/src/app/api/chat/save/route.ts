import { auth } from "@/auth"
import connectDb from "@/lib/db"
import Message from "@/models/message.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        const internalSecret = req.headers.get('x-internal-secret')
        const isInternal = internalSecret === 'my-secure-interal-secret'

        if (!isInternal && !session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { text, roomId, time, senderId: bodySenderId } = await req.json()
        const effectiveSenderId = isInternal ? bodySenderId : session?.user?.id

        if (!effectiveSenderId) {
            return NextResponse.json({ message: "Sender ID missing" }, { status: 400 })
        }

        // Authorization check for the room (skip if internal service)
        if (!isInternal && roomId.startsWith('negotiation:')) {
            const [_, farmerId, buyerId] = roomId.split(':')
            if (effectiveSenderId !== farmerId && effectiveSenderId !== buyerId) {
                return NextResponse.json({ message: "Unauthorized room access" }, { status: 403 })
            }
        }
        // For order rooms, ideally we check if user is buyer/deliveryBoy/admin
        // But for now, we at least enforce session senderId

        const message = await Message.create({
            senderId: effectiveSenderId,
            text,
            roomId,
            time
        })
        return NextResponse.json(message, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: `save message error ${error}` }, { status: 500 }
        )
    }
}
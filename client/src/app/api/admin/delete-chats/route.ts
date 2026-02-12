import { auth } from "@/auth"
import connectDb from "@/lib/db"
import Message from "@/models/message.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()

        // Only Admin can delete chats
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized. Admin only." }, { status: 401 })
        }

        const { roomId, userId } = await req.json()

        if (!roomId && !userId) {
            return NextResponse.json({ message: "Please provide a Room ID or User ID to delete chats." }, { status: 400 })
        }

        let query = {}
        if (roomId) {
            // Robust roomId matching
            const roomIdStr = roomId.toString()
            query = {
                $or: [
                    { roomId: roomIdStr },
                    { roomId: { $regex: roomIdStr, $options: 'i' } }
                ]
            }
        } else if (userId) {
            const userIdStr = userId.toString()
            query = {
                $or: [
                    { senderId: userIdStr },
                    { roomId: { $regex: userIdStr, $options: 'i' } }
                ]
            }
        }

        const result = await Message.deleteMany(query)

        return NextResponse.json({
            message: "Chats purged from system",
            deletedCount: result.deletedCount
        }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json(
            { message: `Delete chats error: ${error.message}` }, { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Message from "@/models/message.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();

        if (!session?.user || !['farmer', 'admin', 'shg', 'processor', 'startup'].includes(session.user.role)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const farmerId = session.user.id;

        // Find all rooms starting with "negotiation:{farmerId}"
        // This is a bit tricky with purely unique roomId in Message. 
        // A better way would be a Conversation model, but for now we aggregate.

        const rooms = await Message.aggregate([
            {
                $match: {
                    roomId: { $regex: `^negotiation:${farmerId}:` }
                }
            },
            {
                $group: {
                    _id: "$roomId",
                    lastMessage: { $last: "$text" },
                    lastTime: { $last: "$time" },
                    updatedAt: { $last: "$createdAt" }
                }
            },
            { $sort: { updatedAt: -1 } }
        ]);

        return NextResponse.json(rooms);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

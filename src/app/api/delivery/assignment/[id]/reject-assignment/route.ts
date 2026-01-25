import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string; }>; }) {
    try {
        await connectDb()
        const { id } = await context.params
        const session = await auth()

        if (!session?.user?.id || (session.user.role !== 'deliveryBoy' && session.user.role !== 'admin')) {
            return NextResponse.json({ message: "unauthorize" }, { status: 401 })
        }
        const deliveryBoyId = session.user.id

        const assignment = await DeliveryAssignment.findById(id)
        if (!assignment) {
            return NextResponse.json({ message: "assignment not found" }, { status: 400 })
        }

        // Add to rejectedBy array if not already there
        await DeliveryAssignment.updateOne(
            { _id: id },
            { $addToSet: { rejectedBy: deliveryBoyId } }
        )

        return NextResponse.json({ message: "assignment rejected" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: `reject assignment error ${error}` }, { status: 500 })
    }
}

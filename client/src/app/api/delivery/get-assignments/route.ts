import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()

        // Show all broadcasted assignments OR those specifically for this delivery boy,
        // but EXCLUDE those rejected by this delivery boy
        const assignments = await DeliveryAssignment.find({
            $or: [
                { brodcastedTo: session?.user?.id },
                { status: "brodcasted" }
            ],
            status: "brodcasted",
            rejectedBy: { $ne: session?.user?.id }
        }).populate("order").sort({ createdAt: -1 })

        const validAssignments = assignments.filter((a: any) => a.order !== null);

        return NextResponse.json(
            validAssignments, { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `get assignments error ${error}` }, { status: 200 }
        )
    }
}

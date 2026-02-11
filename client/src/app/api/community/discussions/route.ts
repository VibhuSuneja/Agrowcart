import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Discussion from "@/models/discussion.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const discussions = await Discussion.find({})
            .sort({ createdAt: -1 })
            .limit(50); // Pagination can be added later
        return NextResponse.json(discussions, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching discussions" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const body = await req.json();

        const { sanitizeText, sanitizeUserInput } = await import("@/lib/sanitize");

        const discussion = await Discussion.create({
            title: sanitizeText(body.title || ''),
            body: sanitizeUserInput(body.body || ''),
            tags: Array.isArray(body.tags) ? body.tags.map((t: string) => sanitizeText(t)) : [],
            userId: session.user.id,
            userName: session.user.name,
            userImage: session.user.image,
            comments: []
        });

        return NextResponse.json(discussion, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating discussion" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Discussion from "@/models/discussion.model";
import { auth } from "@/auth";

// GET single discussion
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();
        const { id } = await params;
        const discussion = await Discussion.findById(id);

        if (!discussion) return NextResponse.json({ message: "Not found" }, { status: 404 });

        // Increment views
        discussion.views += 1;
        await discussion.save();

        return NextResponse.json(discussion, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching discussion" }, { status: 500 });
    }
}

// POST comment (Answer)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const { id } = await params;
        const body = await req.json();
        const { sanitizeUserInput } = await import("@/lib/sanitize");

        const discussion = await Discussion.findById(id);
        if (!discussion) return NextResponse.json({ message: "Not found" }, { status: 404 });

        discussion.comments.push({
            userId: session.user.id,
            userName: session.user.name,
            userImage: session.user.image,
            content: sanitizeUserInput(body.content || ''),
            likes: 0,
            likedBy: []
        });

        await discussion.save();

        return NextResponse.json(discussion, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message: `Error adding comment: ${errorMessage}` }, { status: 500 });
    }
}

// PATCH (Like discussion)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const { id } = await params;
        const userId = session.user.id;

        const discussion = await Discussion.findById(id);
        if (!discussion) return NextResponse.json({ message: "Not found" }, { status: 404 });

        // Toggle like
        const hasLiked = discussion.likedBy.includes(userId);
        if (hasLiked) {
            discussion.likedBy = discussion.likedBy.filter((uid: string) => uid !== userId);
            discussion.likes -= 1;
        } else {
            discussion.likedBy.push(userId);
            discussion.likes += 1;
        }

        await discussion.save();
        return NextResponse.json(discussion, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message: `Error liking discussion: ${errorMessage}` }, { status: 500 });
    }
}

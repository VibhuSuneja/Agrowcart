import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Discussion from "@/models/discussion.model";
import { auth } from "@/auth";
import { sanitizeText, sanitizeUserInput } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const discussions = await Discussion.find({})
            .sort({ createdAt: -1 })
            .limit(50);
        return NextResponse.json(discussions, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching discussions" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        // @ts-ignore - session.user.id is added in callbacks but might not be in the default type
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized: Please login again" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.title || !body.body) {
            return NextResponse.json({ message: "Title and Body are required" }, { status: 400 });
        }

        await connectDb();

        const sanitizedTitle = sanitizeText(body.title);
        const sanitizedBody = sanitizeUserInput(body.body);
        const sanitizedTags = Array.isArray(body.tags)
            ? body.tags.map((t: string) => sanitizeText(t)).filter((t: string) => t.length > 0)
            : [];

        const discussion = await Discussion.create({
            title: sanitizedTitle,
            body: sanitizedBody,
            tags: sanitizedTags,
            userId: session.user.id,
            userName: session.user.name || "Anonymous",
            userImage: session.user.image || "",
            comments: []
        });

        return NextResponse.json(discussion, { status: 201 });
    } catch (error) {
        console.error("FORUM_POST_ERROR:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown server error";
        return NextResponse.json({
            message: "Failed to create discussion",
            error: errorMessage
        }, { status: 500 });
    }
}


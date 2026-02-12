import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Discussion from "@/models/discussion.model";
import { auth } from "@/auth";

// Simple server-safe sanitizer (no DOM dependency)
function stripHtml(str: string): string {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/<[^>]*>/g, '')        // Remove HTML tags
        .replace(/[<>"']/g, '')          // Remove dangerous chars
        .trim();
}

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const discussions = await Discussion.find({})
            .sort({ createdAt: -1 })
            .limit(50);
        return NextResponse.json(discussions, { status: 200 });
    } catch (error) {
        console.error("FORUM_GET_ERROR:", error);
        return NextResponse.json({ message: "Error fetching discussions" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized: Please login again" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.title || !body.body) {
            return NextResponse.json({ message: "Title and Body are required" }, { status: 400 });
        }

        await connectDb();

        const discussion = await Discussion.create({
            title: stripHtml(body.title),
            body: stripHtml(body.body),
            tags: Array.isArray(body.tags)
                ? body.tags.map((t: string) => stripHtml(t)).filter((t: string) => t.length > 0)
                : [],
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

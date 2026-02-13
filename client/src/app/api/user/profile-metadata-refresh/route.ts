import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import { sanitizeText, sanitizeUserInput } from "@/lib/sanitize";

export async function GET() {
    return NextResponse.json({
        message: "Profile update endpoint is active. Use POST to update data.",
        methods_allowed: ["POST", "PATCH", "OPTIONS", "GET"]
    }, { status: 200 });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function PATCH(req: NextRequest) {
    return POST(req);
}

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized - Please sign in again" }, { status: 401 });
        }

        // Check content type to ensure it's multipart/form-data
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            // Fallback for JSON requests if needed late, but current client uses FormData
            try {
                const body = await req.json();
                if (body && Object.keys(body).length > 0) {
                    // Logic for JSON body update could go here if we want to be super robust
                }
            } catch (e) { }
        }

        const formData = await req.formData();
        const rawName = formData.get("name") as string;
        const rawBio = formData.get("bio");
        const status = formData.get("status") as string;
        const imageFile = formData.get("image") as File | null;

        const updateData: any = {};

        if (rawName && rawName.trim()) {
            updateData.name = sanitizeText(rawName.trim());
        }

        if (rawBio !== null) {
            updateData.bio = sanitizeUserInput(String(rawBio));
        }

        if (status) {
            const validStatus = ["online", "away", "dnd"].includes(status) ? status : "online";
            updateData.status = validStatus;
        }

        if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
            try {
                const uploadedUrl = await uploadOnCloudinary(imageFile);
                if (uploadedUrl) {
                    updateData.image = uploadedUrl;
                }
            } catch (imgError) {
                console.error("Cloudinary Upload Error:", imgError);
            }
        }

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User account synchronization error" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                bio: user.bio,
                image: user.image,
                status: user.status
            }
        }, { status: 200 });
    } catch (error: any) {
        console.error("Update Profile Critical Error:", error);
        return NextResponse.json({
            message: `Update failure: ${error.message || "Internal server error"}`
        }, { status: 500 });
    }
}


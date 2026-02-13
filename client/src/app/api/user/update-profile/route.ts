import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import { sanitizeText, sanitizeUserInput } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();
        // Robust check for session and identification info
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized - Session missing identifier" }, { status: 401 });
        }

        const formData = await req.formData();
        const rawName = formData.get("name") as string;
        const rawBio = formData.get("bio"); // Can be null if not present
        const status = formData.get("status") as string;
        const imageFile = formData.get("image") as File | null;

        const updateData: any = {};

        // Only update if name is not empty
        if (rawName && rawName.trim()) {
            updateData.name = sanitizeText(rawName.trim());
        }

        // Bio can be empty string (cleared), only skip if null (not in form)
        if (rawBio !== null) {
            updateData.bio = sanitizeUserInput(String(rawBio));
        }

        if (status) {
            const validStatus = ["online", "away", "dnd"].includes(status) ? status : "online";
            updateData.status = validStatus;
        }

        // Handle Image Upload if file is valid
        if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
            try {
                const uploadedUrl = await uploadOnCloudinary(imageFile);
                if (uploadedUrl) {
                    updateData.image = uploadedUrl;
                }
            } catch (imgError) {
                console.error("Cloudinary Upload Error:", imgError);
                // Continue without image update if upload fails
            }
        }

        // Use findOneAndUpdate with email as primary lookup for maximum reliability
        // across different session strategies (JWT/ID vs Email)
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User account not found" }, { status: 404 });
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
            message: `Update failure: ${error.message || "Unknown error"}`
        }, { status: 500 });
    }
}

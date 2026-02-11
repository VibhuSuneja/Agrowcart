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
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const rawName = formData.get("name") as string;
        const rawBio = formData.get("bio") as string;
        const status = formData.get("status") as string;
        const imageFile = formData.get("image") as File | null;

        const updateData: any = {};
        if (rawName) updateData.name = sanitizeText(rawName);
        if (rawBio !== null) updateData.bio = sanitizeUserInput(rawBio);
        if (status) updateData.status = status;

        if (imageFile) {
            const uploadedUrl = await uploadOnCloudinary(imageFile);
            if (uploadedUrl) {
                updateData.image = uploadedUrl;
            }
        }

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
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
        console.error("Update Profile Error:", error);
        return NextResponse.json({ message: `Failed to update profile: ${error.message}` }, { status: 500 });
    }
}

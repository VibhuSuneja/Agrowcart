"use server";

import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import { sanitizeText, sanitizeUserInput } from "@/lib/sanitize";

export async function updateProfileAction(formData: FormData) {
    try {
        await connectDb();

        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, message: "Unauthorized - Please sign in again" };
        }

        const rawName = formData.get("name") as string;
        const rawBio = formData.get("bio") as string;
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

        if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
            try {
                const uploadedUrl = await uploadOnCloudinary(imageFile);
                if (uploadedUrl) {
                    updateData.image = uploadedUrl;
                }
            } catch (imgError) {
                console.error("Cloudinary Upload Error:", imgError);
            }
        }

        if (Object.keys(updateData).length === 0) {
            return { success: false, message: "No fields to update" };
        }

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return { success: false, message: "User not found" };
        }

        return {
            success: true,
            message: "Profile updated successfully",
            user: {
                name: user.name,
                bio: user.bio,
                image: user.image,
                status: user.status,
            },
        };
    } catch (error: any) {
        console.error("Update Profile Error:", error);
        return { success: false, message: error.message || "Internal server error" };
    }
}

"use server";

import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";

interface ProfileResult {
    success: boolean;
    message: string;
    user?: {
        name: string;
        bio: string;
        image: string;
        status: string;
    };
}

// Simple server-safe sanitization (no DOMPurify needed)
function cleanText(input: string): string {
    if (!input || typeof input !== "string") return "";
    return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .trim();
}

export async function updateProfileAction(formData: FormData): Promise<ProfileResult> {
    try {
        await connectDb();

        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, message: "Unauthorized - Please sign in again" };
        }

        const rawName = formData.get("name") as string | null;
        const rawBio = formData.get("bio") as string | null;
        const status = formData.get("status") as string | null;
        const imageFile = formData.get("image") as File | null;

        const updateData: Record<string, string> = {};

        if (rawName && rawName.trim()) {
            updateData.name = cleanText(rawName);
        }

        if (rawBio !== null && rawBio !== undefined) {
            updateData.bio = cleanText(String(rawBio));
        }

        if (status) {
            updateData.status = ["online", "away", "dnd"].includes(status) ? status : "online";
        }

        // Handle image upload
        if (imageFile && typeof imageFile === "object" && imageFile.size > 0 && imageFile.name !== "undefined") {
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

        const user: any = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { new: true, runValidators: true, lean: true }
        );

        if (!user) {
            return { success: false, message: "User not found" };
        }

        return {
            success: true,
            message: "Profile updated successfully",
            user: {
                name: String(user.name || ""),
                bio: String(user.bio || ""),
                image: String(user.image || ""),
                status: String(user.status || "online"),
            },
        };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Internal server error";
        console.error("updateProfileAction Error:", msg);
        return { success: false, message: msg };
    }
}

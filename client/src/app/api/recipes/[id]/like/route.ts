import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Recipe from "@/models/recipe.model";
import { auth } from "@/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const { id } = await params;
        const userId = session.user.id;

        // Get current recipe state
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }

        // Ensure likedBy is an array
        const currentLikedBy: string[] = (recipe.likedBy || []).map((uid: any) => String(uid));
        const hasLiked = currentLikedBy.includes(userId);

        console.log('=== LIKE DEBUG ===');
        console.log('Recipe ID:', id);
        console.log('User ID:', userId);
        console.log('Current likedBy:', currentLikedBy);
        console.log('Has already liked:', hasLiked);
        console.log('Current likes count:', recipe.likes);

        if (hasLiked) {
            // User has liked, so UNLIKE
            const newLikedBy = currentLikedBy.filter(uid => uid !== userId);
            const newLikes = newLikedBy.length;

            await Recipe.updateOne(
                { _id: id },
                {
                    $set: {
                        likedBy: newLikedBy,
                        likes: newLikes
                    }
                }
            );

            console.log('ACTION: Unlike');
            console.log('New likedBy:', newLikedBy);
            console.log('New likes:', newLikes);

            return NextResponse.json({
                liked: false,
                likes: newLikes
            }, { status: 200 });
        } else {
            // User has NOT liked, so LIKE
            const newLikedBy = [...currentLikedBy, userId];
            const newLikes = newLikedBy.length;

            await Recipe.updateOne(
                { _id: id },
                {
                    $set: {
                        likedBy: newLikedBy,
                        likes: newLikes
                    }
                }
            );

            console.log('ACTION: Like');
            console.log('New likedBy:', newLikedBy);
            console.log('New likes:', newLikes);

            return NextResponse.json({
                liked: true,
                likes: newLikes
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json({ message: "Error toggling like" }, { status: 500 });
    }
}

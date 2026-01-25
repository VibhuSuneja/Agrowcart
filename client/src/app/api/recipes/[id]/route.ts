import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Recipe from "@/models/recipe.model";
import { auth } from "@/auth";

// GET: Get recipe details with like info
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();
        const { id } = await params;

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }

        return NextResponse.json({
            _id: recipe._id,
            likes: recipe.likes,
            likedBy: recipe.likedBy?.map((uid: any) => uid.toString()) || [],
            likedByCount: recipe.likedBy?.length || 0
        }, { status: 200 });
    } catch (error) {
        console.error("Get recipe error:", error);
        return NextResponse.json({ message: "Error fetching recipe" }, { status: 500 });
    }
}

// PATCH: Fix/reset likes for a recipe (sync likes count with likedBy array length)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();
        const { id } = await params;

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }

        // Reset likes count to match likedBy array length
        const correctLikes = recipe.likedBy?.length || 0;

        // Also deduplicate likedBy array
        const uniqueLikedBy = [...new Set((recipe.likedBy || []).map((uid: any) => uid.toString()))];

        await Recipe.findByIdAndUpdate(id, {
            likes: uniqueLikedBy.length,
            likedBy: uniqueLikedBy
        });

        return NextResponse.json({
            message: "Likes fixed",
            oldLikes: recipe.likes,
            newLikes: uniqueLikedBy.length,
            likedByCount: uniqueLikedBy.length
        }, { status: 200 });
    } catch (error) {
        console.error("Fix likes error:", error);
        return NextResponse.json({ message: "Error fixing likes" }, { status: 500 });
    }
}

// DELETE: Delete a recipe (only admin or recipe creator can delete)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const { id } = await params;
        const userId = session.user.id;
        const userRole = (session.user as any).role;

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }

        // Check if user is admin OR the recipe creator
        const isAdmin = userRole === "admin";
        const isCreator = recipe.chefId?.toString() === userId;

        if (!isAdmin && !isCreator) {
            return NextResponse.json({
                message: "You don't have permission to delete this recipe"
            }, { status: 403 });
        }

        await Recipe.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Recipe deleted successfully",
            deletedBy: isAdmin ? "admin" : "creator"
        }, { status: 200 });
    } catch (error) {
        console.error("Delete recipe error:", error);
        return NextResponse.json({ message: "Error deleting recipe" }, { status: 500 });
    }
}

// PUT: Update a recipe (only admin or recipe creator can update)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const { id } = await params;
        const userId = session.user.id;
        const userRole = (session.user as any).role;
        const body = await req.json();

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }

        // Check if user is admin OR the recipe creator
        const isAdmin = userRole === "admin";
        const isCreator = recipe.chefId?.toString() === userId;

        if (!isAdmin && !isCreator) {
            return NextResponse.json({
                message: "You don't have permission to edit this recipe"
            }, { status: 403 });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json(updatedRecipe, { status: 200 });
    } catch (error) {
        console.error("Update recipe error:", error);
        return NextResponse.json({ message: "Error updating recipe" }, { status: 500 });
    }
}

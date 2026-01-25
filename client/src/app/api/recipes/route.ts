import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Recipe from "@/models/recipe.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const recipes = await Recipe.find({}).sort({ createdAt: -1 });
        return NextResponse.json(recipes, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching recipes" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDb();
        const body = await req.json();

        // Add the creator's ID to the recipe
        const recipe = await Recipe.create({
            ...body,
            chefId: session.user.id
        });

        return NextResponse.json(recipe, { status: 201 });
    } catch (error) {
        console.error("Create recipe error:", error);
        return NextResponse.json({ message: "Error creating recipe" }, { status: 500 });
    }
}

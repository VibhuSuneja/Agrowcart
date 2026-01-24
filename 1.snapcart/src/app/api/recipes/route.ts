import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Recipe from "@/models/recipe.model";

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
        await connectDb();
        const body = await req.json();
        const recipe = await Recipe.create(body);
        return NextResponse.json(recipe, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating recipe" }, { status: 500 });
    }
}

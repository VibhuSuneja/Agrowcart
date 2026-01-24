import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { productName, category } = await req.json();

        if (!productName) {
            return NextResponse.json({ message: "Product name is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a professional chef specializing in Indian Millets. 
        The user has purchased ${productName} (Category: ${category}). 
        Please provide a unique, healthy, and easy-to-make recipe using this millet.
        Format the response in JSON with the following structure:
        {
            "recipeName": "string",
            "preparationTime": "string",
            "difficulty": "Easy/Medium/Hard",
            "ingredients": ["string"],
            "instructions": ["string"],
            "nutritionalBenefit": "string"
        }
        Only return the JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Basic cleanup of potential markdown code blocks
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const recipe = JSON.parse(jsonString);

        return NextResponse.json(recipe);
    } catch (error: any) {
        console.error("AI Recipe Error:", error);
        return NextResponse.json({ message: "Failed to generate recipe" }, { status: 500 });
    }
}

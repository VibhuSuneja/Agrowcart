import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AIResponse from "@/models/ai-cache.model";
import connectDb from "@/lib/db";
import crypto from "crypto";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { productName, category } = await req.json();

        if (!productName) {
            return NextResponse.json({ message: "Product name is required" }, { status: 400 });
        }

        const cacheKey = `recipe-${productName}-${category}`.toLowerCase().replace(/\s+/g, '-');

        // Check Cache
        const existingCache = await AIResponse.findOne({ key: cacheKey });
        if (existingCache && existingCache.expiry > new Date()) {
            return NextResponse.json(JSON.parse(existingCache.response), {
                headers: { 'X-Cache': 'HIT' }
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

        // Save to Cache
        const promptHash = crypto.createHash('md5').update(prompt).digest('hex');
        await AIResponse.findOneAndUpdate(
            { key: cacheKey },
            {
                promptHash,
                response: JSON.stringify(recipe),
                expiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
            },
            { upsert: true }
        );

        return NextResponse.json(recipe, {
            headers: { 'X-Cache': 'MISS' }
        });
    } catch (error: any) {
        console.error("AI Recipe Error:", error);
        return NextResponse.json({ message: "Failed to generate recipe" }, { status: 500 });
    }
}

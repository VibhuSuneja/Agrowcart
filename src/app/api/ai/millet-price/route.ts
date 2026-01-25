import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import AIResponse from "@/models/ai-cache.model";
import connectDb from "@/lib/db";
import crypto from "crypto";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized. Please login." }, { status: 401 });
        }

        const { region, quantity, crop } = await req.json();

        if (!region || !quantity || !crop) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const prompt = `Predict the market price for ${quantity} kg of ${crop} in ${region}. Return a JSON object with: 
    - estimatedPrice (number)
    - priceTrend (string: "up", "down", "stable")
    - factors (string[])
    - advice (string)
    Do not use markdown formatting.`;

        // Caching Logic
        const promptHash = crypto.createHash('md5').update(prompt).digest('hex');
        const cacheKey = `price-${crop}-${region}-${quantity}`.toLowerCase().replace(/\s+/g, '-');

        const existingCache = await AIResponse.findOne({ key: cacheKey });

        if (existingCache && existingCache.expiry > new Date()) {
            console.log("🚀 Serving from AI Cache:", cacheKey);
            return NextResponse.json(JSON.parse(existingCache.response), {
                status: 200,
                headers: { 'X-Cache': 'HIT' }
            });
        }

        // Try Gemini AI 
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error("API key not configured");
            }

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsedData = JSON.parse(cleanText);

            // Save to Cache (Expires in 24 hours)
            await AIResponse.findOneAndUpdate(
                { key: cacheKey },
                {
                    promptHash,
                    response: JSON.stringify(parsedData),
                    expiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                { upsate: true, new: true, upsert: true }
            );

            return NextResponse.json(parsedData, {
                status: 200,
                headers: { 'X-Cache': 'MISS' }
            });
        } catch (aiError: any) {
            console.warn("Gemini AI failed, using fallback:", aiError.message);

            // Fallback: Return mock prediction
            const mockPrediction = {
                estimatedPrice: Math.floor(Math.random() * (100 - 60) + 60),
                priceTrend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
                factors: [
                    "Seasonal demand in " + region,
                    "Current market surplus",
                    "Transportation costs"
                ],
                advice: `Based on ${quantity} kg of ${crop} in ${region}, consider selling during peak demand season for better returns.`
            };

            return NextResponse.json(mockPrediction, { status: 200 });
        }
    } catch (error: any) {
        console.error("AI Price Prediction Error:", error);
        return NextResponse.json(
            { message: `Failed to predict price: ${error.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}

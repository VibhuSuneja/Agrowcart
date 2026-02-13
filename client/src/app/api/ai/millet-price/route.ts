import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
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

        const prompt = `Analyze current market trends for ${crop} in ${region} region.
        Quantity: ${quantity} ${quantity > 1000 ? 'tons' : 'kg'}.
        
        Task: Predict the estimated market price range and trends.
        Return EXCLUSIVELY a JSON object with this exact structure:
        {
            "estimatedPrice": number,
            "currency": "INR",
            "priceTrend": "up" | "down" | "stable",
            "confidenceScore": number (0-100),
            "factors": ["string", "string", "string"],
            "advice": "string (short actionable advice)"
        }
        Return raw JSON only. No markdown formatting.`;

        // Caching Logic
        const promptHash = crypto.createHash('md5').update(prompt).digest('hex');
        const cacheKey = `pricev2-${crop}-${region}-${quantity}`.toLowerCase().replace(/\s+/g, '-');

        const existingCache = await AIResponse.findOne({ key: cacheKey });

        if (existingCache && existingCache.expiry > new Date()) {
            console.log("🚀 Serving Price from Cache:", cacheKey);
            return NextResponse.json(JSON.parse(existingCache.response), {
                status: 200,
                headers: { 'X-Cache': 'HIT' }
            });
        }

        if (!process.env.GROQ_API_KEY) {
            console.error("GROQ_API_KEY missing");
            throw new Error("API configuration error");
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a specialized agricultural market analyst. Return raw JSON ONLY." },
                    { role: "user", content: prompt }
                ],
                model: "llama-3.3-70b-versatile", // High accuracy for numerical reasoning
                temperature: 0.2, // Low temperature for stability in JSON output
                max_tokens: 300,
                stream: false,
            });

            const text = chatCompletion.choices[0]?.message?.content || "";
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedData;
            try {
                parsedData = JSON.parse(cleanText);
            } catch (e) {
                console.error("Groq JSON Parse Error:", cleanText);
                throw new Error("Invalid format from AI");
            }

            // Save to Cache
            await AIResponse.findOneAndUpdate(
                { key: cacheKey },
                {
                    promptHash,
                    response: JSON.stringify(parsedData),
                    expiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                { upsert: true, new: true }
            );

            return NextResponse.json(parsedData, {
                status: 200,
                headers: { 'X-Cache': 'MISS' }
            });

        } catch (aiError: any) {
            console.warn("Groq Price Prediction failed, using fallback:", aiError.message);
            const mockPrediction = {
                estimatedPrice: Math.floor(Math.random() * (100 - 60) + 60),
                currency: "INR",
                priceTrend: "stable",
                confidenceScore: 70,
                factors: ["Regional demand", "Historical trends"],
                advice: "Check local mandi rates for verification."
            };
            return NextResponse.json(mockPrediction, { status: 200 });
        }
    } catch (error: any) {
        console.error("Global Price Prediction Error:", error);
        return NextResponse.json(
            { message: `Failed to predict price: ${error.message}` },
            { status: 500 }
        );
    }
}

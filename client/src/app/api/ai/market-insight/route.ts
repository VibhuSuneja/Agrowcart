import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
// import Groq from "groq-sdk";
import AIResponse from "@/models/ai-cache.model";
import crypto from "crypto";
import { auth } from "@/auth";
import { getFallbackInsight } from "@/lib/ai-fallback-dataset"; // Import fallback dataset logic

export async function POST(req: NextRequest) {
    try {
        // 1. Authentication Check
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized. Please login to get insights." }, { status: 401 });
        }

        const body = await req.json();
        const { crop } = body;

        // 2. Input Validation
        if (!crop || typeof crop !== 'string' || crop.length > 50) {
            return NextResponse.json({ message: "Invalid crop input" }, { status: 400 });
        }

        const cacheKey = `market-v2-insight-${crop.toLowerCase()}`;

        // 3. Check Cache
        const cached = await AIResponse.findOne({ key: cacheKey });
        if (cached && cached.expiry > new Date()) {
            console.log("🚀 Serving Market Insight from Cache:", cacheKey);
            return NextResponse.json(JSON.parse(cached.response), { status: 200 });
        }



        const prompt = `Provide precise market demand forecasting for ${crop} for the next 6 months in the Indian market.
        
        Return EXCLUSIVELY a JSON object:
        {
            "demandTrend": "string",
            "forecast": "string (professional summary)",
            "highDemandRegions": ["string", "string", "string"]
        }
        Return raw JSON only. No markdown formatting.`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedData;
            try {
                parsedData = JSON.parse(cleanText);
            } catch (e) {
                console.error("Gemini Market Insight JSON Parse Error:", cleanText);
                throw new Error("Invalid format from AI");
            }

            // Store in Cache (24 hours)
            const promptHash = crypto.createHash('md5').update(prompt).digest('hex');
            await AIResponse.findOneAndUpdate(
                { key: cacheKey },
                {
                    response: JSON.stringify(parsedData),
                    promptHash,
                    expiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
                },
                { upsert: true }
            );

            return NextResponse.json(parsedData, { status: 200 });

        } catch (aiError: any) {
            console.warn("Gemini Market Insight failed, using fallback:", aiError.message);
            const fallbackInsight = getFallbackInsight(crop);
            return NextResponse.json(fallbackInsight, { status: 200 });
        }
    } catch (error: any) {
        console.error("AI Market Insight Error:", error.message);
        return NextResponse.json(
            { message: "Global error in market intelligence" },
            { status: 500 }
        );
    }
}

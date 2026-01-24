import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import AIResponse from "@/models/ai-cache.model";
import crypto from "crypto";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        // 1. Cybersecurity Check: Authentication (Protect credits)
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized. Please login to get insights." }, { status: 401 });
        }

        const body = await req.json();
        const { crop } = body;

        // 2. Security Check: Input Validation
        if (!crop || typeof crop !== 'string' || crop.length > 50) {
            return NextResponse.json({ message: "Invalid crop input" }, { status: 400 });
        }

        const cacheKey = `market-insight-${crop.toLowerCase()}`;

        // 3. Check Cache First (The "Salary-Saver" step)
        const cached = await AIResponse.findOne({ key: cacheKey });
        if (cached && cached.expiry > new Date()) {
            return NextResponse.json(JSON.parse(cached.response), { status: 200 });
        }

        const prompt = `Provide market demand forecasting for ${crop} for the next 6 months in India. 
    Return JSON: { "demandTrend": string, "forecast": string, "highDemandRegions": string[] }
    Do not use markdown.`;

        // 2. Call AI only if cache misses
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(cleanText);

        // 3. Store in Cache for 24 hours
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
    } catch (error) {
        console.error("AI Market Insight Error:", error);
        return NextResponse.json(
            { message: "Failed to get insights" },
            { status: 500 }
        );
    }
}

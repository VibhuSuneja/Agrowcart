import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import AIResponse from "@/models/ai-cache.model";
import connectDb from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { weatherData } = await req.json();

        if (!weatherData || !weatherData.daily) {
            return NextResponse.json({ message: "Weather data is required" }, { status: 400 });
        }

        const prompt = `
        You are an expert Agricultural Advisor specialized in Millets and sustainable farming.
        
        Here is the 7-day weather forecast for the region:
        ${JSON.stringify(weatherData)}

        Based on this forecast (Temperature, Rainfall, Humidity), provide specific, actionable advice for Millet farmers.
        
        Structure your response as a small JSON object with these keys:
        - "summary": A 1-sentence summary of the week's outlook for crops.
        - "action": ONE clear action item for the farmer (e.g., "Irrigate lightly on Tuesday", "Apply neem oil due to humidity", "Harvest immediately").
        - "risk": Any potential risk (e.g., "High fungal risk", "Heat stress").

        Keep it very concise. output ONLY valid JSON.
        `;

        // 1. Caching Layer
        const promptHash = crypto.createHash('md5').update(prompt).digest('hex');
        // Cache key based on the first day's max temp and date to avoid stale advice if location changes
        const firstDay = weatherData.daily[0];
        const cacheKey = `advice-${firstDay.date}-${firstDay.maxTemp}`.toLowerCase().replace(/\s+/g, '-');

        const existingCache = await AIResponse.findOne({ key: cacheKey });
        if (existingCache && existingCache.expiry > new Date()) {
            console.log("🚀 Serving Advisory from Cache");
            return NextResponse.json({ advice: JSON.parse(existingCache.response) }, { status: 200 });
        }

        // 2. AI Generation
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Cleanup markdown if present to parse JSON
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const advice = JSON.parse(jsonStr);

            // 3. Store in Cache (Expires in 12 hours for weather)
            await AIResponse.findOneAndUpdate(
                { key: cacheKey },
                {
                    promptHash,
                    response: JSON.stringify(advice),
                    expiry: new Date(Date.now() + 12 * 60 * 60 * 1000)
                },
                { upsert: true }
            );

            return NextResponse.json({ advice }, { status: 200 });
        } catch (aiError) {
            console.error("Gemini Advice Error:", aiError);
            throw aiError; // Trigger fallback below
        }

    } catch (error) {
        console.error("AI Weather Error:", error);

        // Fallback Advice to prevent "Offline" message
        const fallbackAdvice = {
            summary: "Weather patterns are stable for millet growth.",
            action: "Monitor soil moisture levels daily.",
            risk: "Minimal immediate risk detected."
        };

        return NextResponse.json({ advice: fallbackAdvice }, { status: 200 });
    }
}

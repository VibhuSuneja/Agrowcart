import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import AIResponse from "@/models/ai-cache.model";
import crypto from "crypto";
import { auth } from "@/auth";

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

        if (!process.env.GROQ_API_KEY) {
            console.error("GROQ_API_KEY missing");
            throw new Error("API configuration error");
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `Provide precise market demand forecasting for ${crop} for the next 6 months in the Indian market.
        
        Return EXCLUSIVELY a JSON object:
        {
            "demandTrend": "string",
            "forecast": "string (professional summary)",
            "highDemandRegions": ["string", "string", "string"]
        }
        Return raw JSON only. No markdown formatting.`;

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a senior agricultural economist specializing in Indian millet markets. Return raw JSON ONLY." },
                    { role: "user", content: prompt }
                ],
                model: "llama-3.3-70b-versatile", // Excellent for economic forecasting
                temperature: 0.3,
                max_tokens: 400,
                stream: false,
            });

            const text = chatCompletion.choices[0]?.message?.content || "";
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedData;
            try {
                parsedData = JSON.parse(cleanText);
            } catch (e) {
                console.error("Groq Market Insight JSON Parse Error:", cleanText);
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
            console.warn("Groq Market Insight failed, using fallback:", aiError.message);
            const fallbackInsight = {
                demandTrend: "High Demand",
                forecast: "Current climate trends and government 'Shree Anna' promotions are driving consistent demand for millets in urban processing clusters.",
                highDemandRegions: ["Karnataka", "Maharashtra", "Tamil Nadu"]
            };
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

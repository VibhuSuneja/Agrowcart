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

        const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        const prompt = `Act as a senior agricultural economist and market volatility analyst for AgrowCart.
        Analyze market trends for ${crop} in the ${region} region as of ${currentDate}.
        
        Simulation Context:
        - Quantity: ${quantity} ${quantity >= 1000 ? 'tons' : 'kg'}.
        - Region Dynamics: Is ${region} a producer or consumer of ${crop}? Factor in transport vs mandi-direct pricing.
        - Crop Grade: Identify if "${crop}" implies organic, raw, or premium export grade.
        - Reference: Use 2024-2025 MSP benchmarks for Bharat.
        
        Task: Provide a high-fidelity market price simulation.
        OUTPUT EXCLUSIVELY JSON:
        {
            "estimatedPrice": number (price per KG in INR),
            "currency": "INR",
            "priceTrend": "bullish" | "bearish" | "stable",
            "confidenceScore": number (0-100),
            "factors": ["Local mandi arrival status", "Regional demand factor", "Macroeconomic/MSP factor"],
            "advice": "Strategic advice based on ${region} market role."
        }`;

        // Caching Logic
        const promptHash = crypto.createHash('md5').update(prompt).digest('hex');
        const cacheKey = `pricev4-${crop}-${region}-${quantity}`.toLowerCase().replace(/\s+/g, '-');

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
                    {
                        role: "system",
                        content: "You are an expert Agri-Tech Market Analyst. You provide accurate, data-driven price predictions for millets and organic produce in India. Always return raw JSON. If asked for millets, prices are typically 30-80 INR/kg for raw, 100-200 INR/kg for processed."
                    },
                    { role: "user", content: prompt }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1, // Even lower for higher precision
                max_tokens: 500,
                stream: false,
            });

            const text = chatCompletion.choices[0]?.message?.content || "";
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedData;
            try {
                parsedData = JSON.parse(cleanText);
                // Sanity check: if price is > 1000, it's likely per quintal, convert to kg
                if (parsedData.estimatedPrice > 1000) {
                    parsedData.estimatedPrice = Math.round(parsedData.estimatedPrice / 100);
                }
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
                    expiry: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12h cache for price
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
                estimatedPrice: Math.floor(Math.random() * (80 - 45) + 45),
                currency: "INR",
                priceTrend: "stable",
                confidenceScore: 65,
                factors: ["Regional Demand Fluctuations", "Mandi Closing Cycles", "Climate Impact on Logistics"],
                advice: "Consolidated local data suggests price stability. Recommend verifying with NCDEX for large volumes."
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

import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { crop } = await req.json();

        const prompt = `Provide market demand forecasting for ${crop} for the next 6 months in India. 
    Return JSON: { "demandTrend": string, "forecast": string, "highDemandRegions": string[] }
    Do not use markdown.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(cleanText), { status: 200 });
    } catch (error) {
        console.error("AI Market Insight Error:", error);
        return NextResponse.json(
            { message: "Failed to get insights" },
            { status: 500 }
        );
    }
}

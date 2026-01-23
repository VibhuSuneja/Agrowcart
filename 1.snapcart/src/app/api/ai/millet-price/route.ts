import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { region, quantity, crop } = await req.json();

        // Try Gemini AI first
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error("API key not configured");
            }

            const prompt = `Predict the market price for ${quantity} kg of ${crop} in ${region}. Return a JSON object with: 
    - estimatedPrice (number)
    - priceTrend (string: "up", "down", "stable")
    - factors (string[])
    - advice (string)
    Do not use markdown formatting.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return NextResponse.json(JSON.parse(cleanText), { status: 200 });
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

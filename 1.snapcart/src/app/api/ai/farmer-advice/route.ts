import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { weatherData } = await req.json();

        if (!weatherData) {
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

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            return NextResponse.json({ message: `Gemini Error: ${response.status} - ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Cleanup markdown if present to parse JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const advice = JSON.parse(jsonStr);

        return NextResponse.json({ advice }, { status: 200 });

    } catch (error) {
        console.error("AI Weather Error:", error);
        return NextResponse.json({ message: "Error generating advice" }, { status: 500 });
    }
}

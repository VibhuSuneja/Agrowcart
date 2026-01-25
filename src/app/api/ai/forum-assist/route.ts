import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { question, description } = await req.json();

        if (!question) {
            return NextResponse.json({ message: "Question is required" }, { status: 400 });
        }

        // Construct the prompt for Gemini
        const prompt = `You are a helpful expert on Millets. A user asks: "${question}".
        Details: "${description || ''}".
        Provide a clear, accurate, and encouraging answer under 200 words. Use markdown.`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Gemini API Key is missing");
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            return NextResponse.json({ message: `Gemini API Error: ${response.status} - ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        const aiAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I could not generate an answer.";

        return NextResponse.json({ result: aiAnswer }, { status: 200 });

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ message: "Error generating answer" }, { status: 500 });
    }
}

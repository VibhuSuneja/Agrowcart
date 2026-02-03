import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { message, role } = await req.json()

        if (!message) {
            return NextResponse.json([], { status: 200 });
        }

        const prompt = `You are a professional delivery assistant chatbot for Agrowcart.

Context:
- Role of person receiving suggestions: ${role}
- Last message received: "${message}"

Task:
Generate exactly 3 short, helpful, and natural reply suggestions.
👉 If role is "user" → generate replies for a customer to send to a delivery boy.
👉 If role is "delivery_boy" → generate replies for a delivery boy to send to a customer.

Rules:
- Replies must be relevant to the context of the last message.
- Keep replies short (max 6 words).
- Use max one emoji per reply.
- Return ONLY the suggestions as a comma-separated list.
- DO NOT use numbers, bullets, or extra text.
- Example output: Yes, please leave it at the gate. 🚪, I am coming down now. 🏃‍♂️, Thank you so much! 🙏`

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            })
        })

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Gemini API Error:", errorData);
            return NextResponse.json([], { status: 200 });
        }

        const data = await response.json()
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

        // Robust parsing: split by comma, filter out empty strings
        const suggestions = replyText
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0)
            .slice(0, 3); // Ensure only 3

        return NextResponse.json(
            suggestions, { status: 200 }
        )

    } catch (error) {
        console.error("AI Suggestions Route Error:", error);
        return NextResponse.json(
            [], { status: 200 }
        )
    }
}

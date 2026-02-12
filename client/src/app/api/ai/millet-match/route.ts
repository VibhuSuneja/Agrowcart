import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { answers } = await req.json();

        if (!answers || !Array.isArray(answers)) {
            return NextResponse.json({ message: "Invalid answers format" }, { status: 400 });
        }

        const prompt = `You are the 'Shree Anna Soul Guide'. 
        A user has completed a lifestyle personality quiz. Match them to one of the 9 major millets: 
        Ragi, Jowar, Bajra, Foxtail, Kodo, Little, Barnyard, Proso, or Browntop.
        
        USER ANSWERS:
        1. Energy Signature: ${answers[0]}
        2. Resilience Mode: ${answers[1]}
        3. Wellness Priority: ${answers[2]}
        4. Stress Response: ${answers[3]}
        5. Palate Preference: ${answers[4]}
        
        REQUIREMENTS:
        - Provide a creative "Soul Match" title (e.g., 'The Climate Warrior', 'The Brain Catalyst').
        - Explain why this millet is their perfect match based on their answers.
        - List 3 "Power Traits" of this millet.
        - Keep it fast, engaging, and gamified.
        
        OUTPUT FORMAT (Strict JSON):
        {
          "milletName": "Name of the Millet",
          "soulTitle": "Creative Title",
          "matchAnalysis": "Enthusiastic explanation of the match",
          "powerTraits": ["Trait 1", "Trait 2", "Trait 3"],
          "recomendedDish": "A popular dish made with this millet"
        }
        Do not use markdown blocks outside the JSON.`;

        // Use a faster response pattern if possible, though Gemini 1.5 Flash is already fast.
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(cleanText);

        return NextResponse.json(parsedData, { status: 200 });

    } catch (error: any) {
        console.error("Millet Match Error:", error);
        return NextResponse.json(
            { message: `Failed to find your soul millet: ${error.message}` },
            { status: 500 }
        );
    }
}

import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { goal, currentWeight, age, activityLevel } = await req.json();

        if (!goal) {
            return NextResponse.json({ message: "Health goal is required" }, { status: 400 });
        }

        const prompt = `You are a world-class AI Nutritionist specializing in 'Shree Anna' (Millets). 
        Generate a personalized 7-Day Millet-based Meal Plan for a user with the goal: ${goal}.
        User Context: Age ${age || 'N/A'}, Activity Level: ${activityLevel || 'Moderate'}.
        
        The plan should feature various millets: Ragi (Finger Millet), Jowar (Sorghum), Bajra (Pearl Millet), Foxtail, Kodo, Barnyard, Little, and Proso millets.
        
        For each day, provide:
        - Breakfast, Lunch, Snack, Dinner.
        - One key "Shree Anna" ingredient for each meal.
        - Briefly explain why this plan helps with the goal: ${goal}.
        
        OUTPUT FORMAT (Strict JSON):
        {
          "summary": "AI summary of the nutrition strategy",
          "plan": [
            {
              "day": 1,
              "meals": {
                "breakfast": { "dish": "Dish Name", "ingredient": "Primary Millet", "benefits": "Why this meal?" },
                "lunch": { "dish": "Dish Name", "ingredient": "Primary Millet", "benefits": "Why this meal?" },
                "snack": { "dish": "Dish Name", "ingredient": "Primary Millet", "benefits": "Why this meal?" },
                "dinner": { "dish": "Dish Name", "ingredient": "Primary Millet", "benefits": "Why this meal?" }
              }
            },
            ... up to day 7
          ],
          "shoppingList": [
            { "item": "Millet Name", "quantity": "Approx quantity for 1 week" }
          ]
        }
        Do not use markdown blocks outside the JSON.`;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ message: "AI Engine offline" }, { status: 500 });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(cleanText);

        return NextResponse.json(parsedData, { status: 200 });

    } catch (error: any) {
        console.error("AI Nutritionist Error:", error);
        return NextResponse.json(
            { message: `Failed to generate nutrition plan: ${error.message}` },
            { status: 500 }
        );
    }
}

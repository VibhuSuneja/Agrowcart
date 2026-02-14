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
    let text = response.text();

    // Robust JSON extraction
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      console.error("No JSON structure found in AI response:", text);
      throw new Error("Invalid format from AI");
    }

    const jsonText = text.substring(firstBrace, lastBrace + 1);

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON Parse Error. Cleaned text:", jsonText);
      throw new Error("AI returned malformed data. Please try again.");
    }

    return NextResponse.json(parsedData, { status: 200 });

  } catch (error: any) {
    console.error("AI Nutritionist Error:", error);

    // Comprehensive Fallback Plan for consistent UX
    const fallbackPlan = {
      "summary": "This is a balanced 7-day millet-based meal plan optimized for general wellness and energy stability.",
      "plan": Array.from({ length: 7 }, (_, i) => ({
        "day": i + 1,
        "meals": {
          "breakfast": { "dish": "Ragi Malt with Fruits", "ingredient": "Ragi (Finger Millet)", "benefits": "High calcium and sustained energy." },
          "lunch": { "dish": "Jowar Roti with Dal", "ingredient": "Jowar (Sorghum)", "benefits": "Gluten-free and high protein." },
          "snack": { "dish": "Roasted Bajra Flakes", "ingredient": "Bajra (Pearl Millet)", "benefits": "Rich in iron." },
          "dinner": { "dish": "Foxtail Millet Khichdi", "ingredient": "Foxtail Millet", "benefits": "Easy to digest, perfect for night." }
        }
      })),
      "shoppingList": [
        { "item": "Ragi Flour", "quantity": "500g" },
        { "item": "Jowar Flour", "quantity": "1kg" },
        { "item": "Foxtail Millet", "quantity": "500g" },
        { "item": "Bajra Flakes", "quantity": "250g" }
      ]
    };

    return NextResponse.json(fallbackPlan, { status: 200 });
  }
}

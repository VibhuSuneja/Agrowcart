module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/ai/recipe-assist/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(req) {
    try {
        const { action, data } = await req.json();
        if (!action) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Action is required"
            }, {
                status: 400
            });
        }
        let prompt = "";
        switch(action){
            case "improve_title":
                prompt = `Improve this millet recipe title to be more catchy and appetizing. Keep it concise (max 8 words).
                
Current title: "${data.title}"

Respond with ONLY the improved title, nothing else. No quotes, no explanation.`;
                break;
            case "improve_description":
                prompt = `Improve this millet recipe description to be more engaging and mouth-watering. Keep it under 150 characters.
                
Recipe: ${data.title}
Current description: "${data.description || 'No description yet'}"

Respond with ONLY the improved description, nothing else. No quotes, no explanation.`;
                break;
            case "suggest_ingredients":
                prompt = `Suggest 5-8 ingredients for this millet recipe. Be specific with quantities.

Recipe: ${data.title}
Description: ${data.description || 'A healthy millet dish'}

Respond with ONLY a valid JSON array of strings, each being an ingredient with quantity. Example format:
["1 cup ragi flour", "2 tbsp ghee", "1 tsp cumin seeds", "Salt to taste"]
No markdown, no explanation, just the JSON array.`;
                break;
            case "suggest_instructions":
                prompt = `Write step-by-step cooking instructions for this millet recipe. Be clear and concise.

Recipe: ${data.title}
Description: ${data.description || 'A healthy millet dish'}
Ingredients: ${JSON.stringify(data.ingredients?.filter((i)=>i.trim()) || [])}

Respond with ONLY a valid JSON array of strings, each being a step. Keep steps short. Example format:
["Soak the millet for 4 hours", "Grind to a smooth batter", "Heat a pan and pour batter"]
No markdown, no explanation, just the JSON array.`;
                break;
            case "suggest_tags":
                prompt = `Suggest 3-5 relevant tags for this millet recipe.

Recipe: ${data.title}
Description: ${data.description || 'A healthy millet dish'}

Respond with ONLY a valid JSON array of single-word or two-word tags. Example format:
["Breakfast", "Gluten-Free", "High-Protein", "South Indian"]
No markdown, no explanation, just the JSON array.`;
                break;
            case "full_recipe":
                prompt = `Generate a complete millet recipe based on this title: "${data.title || 'Healthy Millet Dish'}"

Respond with ONLY valid JSON in this exact format, no markdown:
{
    "title": "Catchy recipe title",
    "description": "Appetizing description under 150 chars",
    "timeToCook": "30 mins",
    "difficulty": "Easy",
    "ingredients": ["1 cup millet", "2 tbsp oil", "1 tsp salt"],
    "instructions": ["Step 1 here", "Step 2 here", "Step 3 here"],
    "tags": ["Healthy", "Quick", "Dinner"]
}
No markdown code blocks, just the JSON object.`;
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: "Invalid action"
                }, {
                    status: 400
                });
        }
        // Use the same API approach as the working chatbot
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "AI assistance failed",
                error: errorData?.error?.message || "API request failed"
            }, {
                status: 500
            });
        }
        const responseData = await response.json();
        const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        if (!text) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "No response from AI"
            }, {
                status: 500
            });
        }
        // Clean up response - remove markdown code blocks if present
        let cleanedText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        // Parse JSON responses
        if ([
            "suggest_ingredients",
            "suggest_instructions",
            "suggest_tags",
            "full_recipe"
        ].includes(action)) {
            try {
                const parsed = JSON.parse(cleanedText);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    result: parsed
                }, {
                    status: 200
                });
            } catch (parseError) {
                // Try to extract JSON from the text
                const jsonMatch = cleanedText.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const parsed = JSON.parse(jsonMatch[0]);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            result: parsed
                        }, {
                            status: 200
                        });
                    } catch (e) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            result: cleanedText
                        }, {
                            status: 200
                        });
                    }
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    result: cleanedText
                }, {
                    status: 200
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            result: cleanedText
        }, {
            status: 200
        });
    } catch (error) {
        console.error("AI Recipe Assistant error:", error?.message || error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "AI assistance failed",
            error: error?.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1aa7c0ca._.js.map
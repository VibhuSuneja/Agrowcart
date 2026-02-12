import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized. Please login." }, { status: 401 });
        }

        const { scheme, farmerData, produceDetails } = await req.json();

        if (!scheme || !farmerData || !produceDetails) {
            return NextResponse.json({ message: "Missing required contract parameters" }, { status: 400 });
        }

        const prompt = `Generate a professional 'Millet Sourcing Agreement' for the government scheme: ${scheme}.
        
        PARTIES:
        - Producer: ${farmerData.name}, residing at ${farmerData.location} (Role: ${farmerData.role})
        - Procurement Body: Relevant Government ${scheme} Authority
        
        PRODUCE DETAILS:
        - Crop: ${produceDetails.name}
        - Quantity: ${produceDetails.quantity} ${produceDetails.unit}
        - Price: ₹${produceDetails.price} per ${produceDetails.unit}
        
        REQUIREMENTS:
        1. Use formal legal terminology suitable for Indian agricultural contracts.
        2. Include sections for: Recitals, Scope of Supply, Quality Standards, Delivery & Logistics, Payment Terms, Dispute Resolution, and Force Majeure.
        3. Identify 3-4 "Critical Clauses" that are extremely important for the farmer to understand.
        
        OUTPUT FORMAT (JSON):
        {
          "contractTitle": "String",
          "content": "Full markdown-formatted contract text",
          "criticalClauses": [
            {
              "title": "Clause Title",
              "originalText": "Snippets from the contract",
              "plainLanguage": "Simplified explanation for a non-technical farmer",
              "impact": "High/Medium/Low"
            }
          ],
          "legalFootnote": "Standard legal disclaimer"
        }
        Do not use markdown blocks outside the JSON.`;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ message: "AI Engine offline. Please check API configuration." }, { status: 500 });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(cleanText);

        return NextResponse.json(parsedData, { status: 200 });

    } catch (error: any) {
        console.error("Contract Generation Error:", error);
        return NextResponse.json(
            { message: `Failed to generate contract: ${error.message || "Internal server error"}` },
            { status: 500 }
        );
    }
}

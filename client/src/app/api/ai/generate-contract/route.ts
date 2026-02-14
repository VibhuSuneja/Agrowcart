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

        const prompt = `You are a high-end Legal Tech AI specializing in Indian Agricultural Law and Institutional Procurement.
        Generate a professional 'Institutional Sourcing Agreement' for the government scheme: ${scheme}.
        
        PARTIES:
        - Producer (First Party): ${farmerData.name}, location: ${farmerData.location} (Role: ${farmerData.role})
        - Procurement Body (Second Party): Relevant Government ${scheme} Authority
        
        PRODUCE & TRANSACTION DETAILS:
        - Commodity: ${produceDetails.name}
        - Total Quantity: ${produceDetails.quantity} ${produceDetails.unit}
        - Negotiated Price: ₹${produceDetails.price} per ${produceDetails.unit}
        
        CONTRACT STRUCTURE REQUIREMENTS:
        1. Use rigorous, formal legal terminology typical of Indian government contracts (e.g., 'hereinafter referred to', 'indemnification', 'arbitration').
        2. MANDATORY SECTIONS: 
           - Recitals (Context of the scheme)
           - Scope of Supply & Specifications
           - Quality Assurance & Inspection Protocols
           - Logistics, Delivery Timelines & Packaging
           - Multi-stage Payment Terms (Advancement, Realization, Final Settlement)
           - Warranties & Representations
           - Dispute Resolution (Conciliation & Arbitration as per Indian laws)
           - Termination & Force Majeure
        3. CRITICAL CLAUSES: Identify 4 specific clauses that carry high legal or financial risk for the farmer/SHG (e.g., rejection criteria, delayed payment interest).
        
        STRICT OUTPUT FORMAT (JSON ONLY):
        {
          "contractTitle": "String (Formal Title)",
          "content": "Full markdown-formatted contract text with H1, H2, bolding, and numbered lists",
          "criticalClauses": [
            {
              "title": "Short Clause Title",
              "originalText": "Exact snippet from the generated content",
              "plainLanguage": "Ultra-clear, simple explanation for a rural producer",
              "impact": "High | Medium | Low"
            }
          ],
          "legalFootnote": "Comprehensive legal disclaimer stating this is an AI-generated draft for negotiation assistance only and does not constitute final legal advice."
        }
        Do not include any conversational text or markdown blocks (like \`\`\`json) in your response. Return ONLY the JSON object.`;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ message: "AI Engine offline. Please check API configuration." }, { status: 500 });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Robust JSON extraction
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("Invalid AI response format");
        }

        const jsonText = text.substring(firstBrace, lastBrace + 1);
        const parsedData = JSON.parse(jsonText);

        return NextResponse.json(parsedData, { status: 200 });

    } catch (error: any) {
        console.error("Contract Generation Error:", error);

        // Safety Fallback
        if (error.message?.toLowerCase().includes("safety") || error.message?.toLowerCase().includes("blocked")) {
            return NextResponse.json({
                contractTitle: "Draft Sourcing Agreement (Standard Template)",
                content: "# Institutional Sourcing Agreement\n\n## 1. PREAMBLE\nStandard negotiate draft...",
                criticalClauses: [{ title: "Standard Quality", originalText: "Produce must meet grades", plainLanguage: "Quality matters", impact: "High" }],
                legalFootnote: "SAFETY FALLBACK: Standardized legal template provided."
            }, { status: 200 });
        }

        return NextResponse.json({ message: `Contract Error: ${error.message}` }, { status: 500 });
    }
}

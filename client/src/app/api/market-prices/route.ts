import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Sample market prices - In production, this would fetch from government APIs
        // like agmarknet.gov.in or India's AGRI DATA portal
        const marketPrices = [
            { crop: "Foxtail Millet", market: "APMC Bangalore", price: 45, unit: "kg", date: new Date().toLocaleDateString() },
            { crop: "Pearl Millet", market: "APMC Delhi", price: 38, unit: "kg", date: new Date().toLocaleDateString() },
            { crop: "Finger Millet (Ragi)", market: "APMC Hyderabad", price: 42, unit: "kg", date: new Date().toLocaleDateString() },
            { crop: "Little Millet", market: "APMC Mumbai", price: 48, unit: "kg", date: new Date().toLocaleDateString() },
            { crop: "Barnyard Millet", market: "APMC Chennai", price: 50, unit: "kg", date: new Date().toLocaleDateString() },
            { crop: "Kodo Millet", market: "APMC Pune", price: 47, unit: "kg", date: new Date().toLocaleDateString() },
        ];

        return NextResponse.json({
            success: true,
            data: marketPrices,
            lastUpdated: new Date().toISOString(),
            source: "AgrowCart Market Intelligence"
        }, { status: 200 });

    } catch (error: any) {
        console.error("Market prices error:", error);
        return NextResponse.json(
            { message: `Failed to fetch market prices: ${error.message}` },
            { status: 500 }
        );
    }
}

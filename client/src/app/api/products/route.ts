import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        // Allow buyers, startups, processors, and farmers to see the marketplace
        const allowedRoles = ["admin", "buyer", "startup", "processor", "farmer", "shg", "user"];
        if (!allowedRoles.includes(session.user.role as string)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        const products = await Product.find({}).populate("owner", "name role").sort({ createdAt: -1 });
        return NextResponse.json(products, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `Failed to fetch products: ${error}` }, { status: 500 })
    }
}

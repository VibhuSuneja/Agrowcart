import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { authRateLimit, getClientIdentifier, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
    // Rate limiting check
    const clientId = getClientIdentifier(req);
    const rateLimitResult = authRateLimit.check(`register:${clientId}`);
    if (!rateLimitResult.success) {
        return rateLimitResponse(rateLimitResult.resetIn);
    }

    try {
        await connectDb()
        const { name, email, password, role, agreed } = await req.json()
        const existUser = await User.findOne({ email })
        if (existUser) {
            return NextResponse.json(
                { message: "email already exist!" },
                { status: 400 }
            )
        }
        if (password.length < 6) {
            return NextResponse.json(
                { message: "password must be at least 6 characters" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Security: Prevent public registration as admin
        let finalRole = role || 'user'
        if (finalRole === 'admin') {
            return NextResponse.json(
                { message: "Unauthorized role assignment" },
                { status: 403 }
            )
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: finalRole,
            agreedToTerms: agreed ? new Date() : undefined
        })
        return NextResponse.json(
            user,
            { status: 200 }
        )

    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json(
            { message: `Register failed: ${error.message || error}` },
            { status: 500 }
        )
    }
}
// connect db
// name,email,password frontend
// email check
// password 6 character
//password hash
// user create

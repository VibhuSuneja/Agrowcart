import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // To prevent email enumeration, we return success even if user not found
            // but in SIH context, it's better to be explicit or just return success
            return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://agrowcart.com'}/reset-password/${resetToken}`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
                <div style="background: #16a34a; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">AgrowCart</h1>
                </div>
                <div style="padding: 30px;">
                    <h2>Reset Your Password</h2>
                    <p>We received a request to reset your password. Click the button below to choose a new one:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background: #16a34a; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; rounded: 8px; border-radius: 8px; display: inline-block;">Reset Password</a>
                    </div>
                    <p>If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">© 2026 AgrowCart • Millets Value Chain Platform</p>
                </div>
            </div>
        `;

        const result = await sendEmail({
            to: email,
            subject: "Reset Your AgrowCart Password",
            html: emailHtml,
            text: `Reset your password by following this link: ${resetUrl}`
        });

        if (!result.success) {
            return NextResponse.json({
                error: "Failed to send reset email",
                details: result.error
            }, { status: 500 });
        }

        return NextResponse.json({ message: "Reset link sent to your email" });

    } catch (error: any) {
        console.error("Forgot password error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error?.message || "Unknown error"
        }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

// RpID must be the same as registration. Using agrowcart.com as default for production.
const rpID = process.env.NEXT_PUBLIC_RP_ID || (process.env.NODE_ENV === 'production' ? 'agrowcart.com' : 'localhost')

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (!user.passkeys || user.passkeys.length === 0) {
            return NextResponse.json({ error: 'No passkeys registered for this account' }, { status: 400 })
        }

        // Get user's registered credentials, filtering out any corrupt entries
        const allowCredentials = user.passkeys
            .filter((cred: any) => cred.credentialID)
            .map((cred: any) => ({
                id: cred.credentialID, // Already base64url in DB
                transports: cred.transports || []
            }))

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials,
            userVerification: 'preferred',
        })

        // Store challenge for verification
        await User.findByIdAndUpdate(user._id, {
            $set: { 'passkeyChallenge': options.challenge }
        })

        // SimpleWebAuthn v10+ returns JSON-safe options if configured correctly, 
        // but let's be absolutely sure everything is a string
        return NextResponse.json({
            ...options,
            userId: user._id.toString()
        })
    } catch (error: any) {
        console.error('Passkey authentication options error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to generate options',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 })
    }
}

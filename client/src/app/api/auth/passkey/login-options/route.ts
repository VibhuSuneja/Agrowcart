'use server'
import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost'

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

        // Get user's registered credentials
        const allowCredentials = user.passkeys.map((cred: any) => ({
            id: Buffer.from(cred.credentialID, 'base64url'),
            transports: cred.transports || []
        }))

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials,
            userVerification: 'preferred',
            timeout: 60000
        })

        // Store challenge for verification
        await User.findByIdAndUpdate(user._id, {
            $set: { 'passkeyChallenge': options.challenge }
        })

        // Ensure allowCredentials IDs are strings (base64url) for the client
        // Next.js/JSON serializes Buffers as objects, which breaks the client
        const sanitizedOptions = {
            ...options,
            allowCredentials: options.allowCredentials?.map((c: any) => ({
                ...c,
                id: Buffer.from(c.id).toString('base64url')
            }))
        }

        return NextResponse.json({ ...sanitizedOptions, userId: user._id.toString() })
    } catch (error: any) {
        console.error('Passkey authentication options error:', error)
        return NextResponse.json({ error: error.message || 'Failed to generate options' }, { status: 500 })
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

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

        // Standardize rpID to base domain
        const hostname = req.nextUrl.hostname;
        const rpID = hostname.includes('agrowcart.com') ? 'agrowcart.com' : hostname;

        // CRITICAL FIX: Convert string IDs back to Buffers
        // If we pass strings, the library double-encodes them and the browser/Windows won't find the match.
        const allowCredentials = user.passkeys
            .filter((cred: any) => cred.credentialID)
            .map((cred: any) => ({
                id: Buffer.from(cred.credentialID, 'base64url'),
                transports: cred.transports || []
            }))

        console.log('Login Options - User:', user.email, 'RPID:', rpID, 'CredCount:', allowCredentials.length)

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials,
            userVerification: 'preferred',
        })

        // Store challenge for verification
        await User.findByIdAndUpdate(user._id, {
            $set: { 'passkeyChallenge': options.challenge }
        })

        return NextResponse.json({
            ...options,
            userId: user._id.toString()
        })
    } catch (error: any) {
        console.error('Passkey authentication options error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to generate options',
            details: error.toString()
        }, { status: 500 })
    }
}

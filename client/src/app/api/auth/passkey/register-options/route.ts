import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

// Relying Party configuration
const rpName = 'AgrowCart'
const rpID = process.env.NEXT_PUBLIC_RP_ID || (process.env.NODE_ENV === 'production' ? 'agrowcart.com' : 'localhost')

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await User.findById(session.user.id)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get existing credentials to exclude them
        const excludeCredentials = (user.passkeys || []).map((cred: any) => ({
            id: Buffer.from(cred.credentialID, 'base64url'),
            transports: cred.transports || []
        }))

        // Normalize rpID: remove www. and use hostname for maximum compatibility
        const hostname = req.nextUrl.hostname;
        const currentRpID = process.env.NEXT_PUBLIC_RP_ID || (hostname.startsWith('www.') ? hostname.slice(4) : hostname);

        const options = await generateRegistrationOptions({
            rpName,
            rpID: currentRpID,
            userID: Buffer.from(user._id.toString()), // Use DB ID
            userName: user.email,
            userDisplayName: user.name || user.email,
            attestationType: 'none',
            excludeCredentials,
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform'
            },
            supportedAlgorithmIDs: [-7, -257] // ES256 and RS256
        })

        // Store challenge for verification (already base64url string in v10+)
        await User.findByIdAndUpdate(session.user.id, {
            $set: { 'passkeyChallenge': options.challenge }
        })

        // Return options directly - simplewebauthn v10+ returns JSON-safe values
        return NextResponse.json(options)
    } catch (error: any) {
        console.error('Passkey registration options error:', error)
        return NextResponse.json({ error: error.message || 'Failed to generate options' }, { status: 500 })
    }
}

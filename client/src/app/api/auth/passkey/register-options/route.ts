import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

// Relying Party configuration
const rpName = 'AgrowCart'

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

        // Normalize rpID - MUST be the base domain (e.g., agrowcart.com)
        const hostname = req.nextUrl.hostname;
        const rpID = hostname.startsWith('www.') ? hostname.slice(4) : hostname;

        // Get existing credentials to exclude
        const excludeCredentials = (user.passkeys || []).map((cred: any) => ({
            id: Buffer.from(cred.credentialID, 'base64url'),
            transports: cred.transports || []
        }))

        // userID: Simple binary of the MongoDB ID string
        const userID = new TextEncoder().encode(user._id.toString());

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID,
            userName: user.email,
            userDisplayName: user.name || user.email,
            attestationType: 'none',
            excludeCredentials,
            authenticatorSelection: {
                residentKey: 'required', // Save in browser store
                userVerification: 'preferred',
                authenticatorAttachment: 'platform' // Force "This Device"
            },
            supportedAlgorithmIDs: [-7, -257]
        })

        // Store challenge for verification
        await User.findByIdAndUpdate(session.user.id, {
            $set: { 'passkeyChallenge': options.challenge }
        })

        return NextResponse.json(options)
    } catch (error: any) {
        console.error('Passkey registration options error:', error)
        return NextResponse.json({ error: error.message || 'Failed to generate options' }, { status: 500 })
    }
}

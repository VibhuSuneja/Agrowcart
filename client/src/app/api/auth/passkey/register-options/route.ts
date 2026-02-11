import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

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

        // ALWAYS use the base domain in production for maximum compatibility
        // This allows passkeys to work on both agrowcart.com and www.agrowcart.com
        const hostname = req.nextUrl.hostname;
        const rpID = hostname.includes('agrowcart.com') ? 'agrowcart.com' : hostname;

        // @simplewebauthn/server v13: excludeCredentials.id expects Base64URLString (plain string), NOT Buffer
        const excludeCredentials = (user.passkeys || []).map((cred: any) => ({
            id: cred.credentialID as string,
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
                residentKey: 'required', // Essential for saving to browser store
                userVerification: 'preferred',
                authenticatorAttachment: 'platform' // Force "This Device" storage
            },
            supportedAlgorithmIDs: [-7, -257]
        })

        await User.findByIdAndUpdate(session.user.id, {
            $set: { 'passkeyChallenge': options.challenge }
        })

        return NextResponse.json(options)
    } catch (error: any) {
        console.error('Passkey registration options error:', error)
        return NextResponse.json({ error: error.message || 'Failed to generate options' }, { status: 500 })
    }
}

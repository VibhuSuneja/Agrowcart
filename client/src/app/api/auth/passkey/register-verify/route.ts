import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

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

        const body = await req.json()
        const expectedChallenge = user.passkeyChallenge

        if (!expectedChallenge) {
            return NextResponse.json({ error: 'No pending challenge found' }, { status: 400 })
        }

        // Standardize currentRpID to base domain
        const hostname = req.nextUrl.hostname;
        const currentRpID = hostname.includes('agrowcart.com') ? 'agrowcart.com' : hostname;

        const possibleOrigins = [
            'https://agrowcart.com',
            'https://www.agrowcart.com',
            'http://localhost:3000'
        ]

        const verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: possibleOrigins,
            expectedRPID: currentRpID,
            requireUserVerification: false
        })

        if (!verification.verified || !verification.registrationInfo) {
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
        }

        const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo

        const newCredential = {
            credentialID: Buffer.from(credential.id).toString('base64url'),
            credentialPublicKey: Buffer.from(credential.publicKey).toString('base64url'),
            counter: credential.counter,
            transports: body.response.transports || [],
            createdAt: new Date()
        }

        await User.findByIdAndUpdate(session.user.id, {
            $push: { passkeys: newCredential },
            $unset: { passkeyChallenge: '' }
        })

        return NextResponse.json({
            success: true,
            message: 'Passkey registered successfully',
            deviceType: credentialDeviceType,
            backedUp: credentialBackedUp
        })
    } catch (error: any) {
        console.error('Passkey registration verification error:', error)
        return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 })
    }
}

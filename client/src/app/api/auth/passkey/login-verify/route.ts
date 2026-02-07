'use server'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import connectDb from '@/lib/db'
import User from '@/models/user.model'
import { cookies } from 'next/headers'
import { encode } from 'next-auth/jwt'

const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost'
const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const body = await req.json()
        const { userId, response: authResponse } = body

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const expectedChallenge = user.passkeyChallenge
        if (!expectedChallenge) {
            return NextResponse.json({ error: 'No pending challenge found' }, { status: 400 })
        }

        // Find the matching credential
        const credentialID = Buffer.from(authResponse.id, 'base64url').toString('base64url')
        const credential = user.passkeys?.find((c: any) => c.credentialID === credentialID)

        if (!credential) {
            return NextResponse.json({ error: 'Credential not found' }, { status: 400 })
        }

        // Convert Buffer to Uint8Array for simplewebauthn compatibility
        const pubKeyUint8 = new Uint8Array(Buffer.from(credential.credentialPublicKey, 'base64url'))

        const verification = await verifyAuthenticationResponse({
            response: authResponse,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            credential: {
                id: credential.credentialID, // Keep as base64url string
                publicKey: pubKeyUint8,
                counter: credential.counter,
                transports: credential.transports || []
            },
            requireUserVerification: true
        })

        if (!verification.verified) {
            return NextResponse.json({ error: 'Authentication failed' }, { status: 400 })
        }

        // Update counter to prevent replay attacks
        await User.updateOne(
            { _id: userId, 'passkeys.credentialID': credentialID },
            {
                $set: {
                    'passkeys.$.counter': verification.authenticationInfo.newCounter
                },
                $unset: { passkeyChallenge: '' }
            }
        )

        // Create a session token for NextAuth v5
        const secret = process.env.AUTH_SECRET!
        const token = await encode({
            token: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                agreedToTerms: user.agreedToTerms
            },
            secret,
            salt: 'authjs.session-token',
            maxAge: 10 * 24 * 60 * 60 // 10 days
        })

        // Set the session cookie
        const cookieStore = await cookies()
        cookieStore.set('authjs.session-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 24 * 60 * 60,
            path: '/'
        })

        return NextResponse.json({
            success: true,
            message: 'Authentication successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error: any) {
        console.error('Passkey authentication verification error:', error)
        return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 })
    }
}

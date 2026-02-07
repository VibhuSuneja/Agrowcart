import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import connectDb from '@/lib/db'
import User from '@/models/user.model'
import { cookies } from 'next/headers'
import { encode } from 'next-auth/jwt'

const rpID = process.env.NEXT_PUBLIC_RP_ID || (process.env.NODE_ENV === 'production' ? 'agrowcart.com' : 'localhost')

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

        // Detect expected origin from request if not set
        const expectedOrigin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin

        // Find the matching credential
        const credentialID = authResponse.id
        const credential = user.passkeys?.find((c: any) => c.credentialID === credentialID)

        if (!credential) {
            return NextResponse.json({ error: 'Credential not found' }, { status: 400 })
        }

        // Convert Buffer to Uint8Array for simplewebauthn compatibility
        const pubKeyUint8 = new Uint8Array(Buffer.from(credential.credentialPublicKey, 'base64url'))

        const verification = await verifyAuthenticationResponse({
            response: authResponse,
            expectedChallenge,
            expectedOrigin,
            expectedRPID: rpID,
            credential: {
                id: credential.credentialID,
                publicKey: pubKeyUint8,
                counter: credential.counter,
                transports: credential.transports || []
            },
            requireUserVerification: false // More compatible
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
        const cookieName = process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token'

        cookieStore.set(cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 24 * 60 * 60,
            path: '/'
        })

        return NextResponse.json({
            success: true,
            message: 'Authentication successful'
        })
    } catch (error: any) {
        console.error('Passkey authentication verification error:', error)
        return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 })
    }
}

'use server'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await User.findById(session.user.id).select('passkeys')
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Return sanitized passkey data (exclude sensitive fields)
        const passkeys = (user.passkeys || []).map((p: any) => ({
            credentialID: p.credentialID,
            createdAt: p.createdAt,
            transports: p.transports
        }))

        return NextResponse.json({
            success: true,
            passkeys
        })
    } catch (error: any) {
        console.error('Passkey list error:', error)
        return NextResponse.json({ error: error.message || 'Failed to fetch passkeys' }, { status: 500 })
    }
}

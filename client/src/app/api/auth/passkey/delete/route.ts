'use server'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import User from '@/models/user.model'

export async function DELETE(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { credentialID } = await req.json()

        if (!credentialID) {
            return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
        }

        const user = await User.findById(session.user.id)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check if the credential exists
        const credentialExists = user.passkeys?.some((c: any) => c.credentialID === credentialID)
        if (!credentialExists) {
            return NextResponse.json({ error: 'Passkey not found' }, { status: 404 })
        }

        // Remove the passkey
        await User.findByIdAndUpdate(session.user.id, {
            $pull: { passkeys: { credentialID } }
        })

        return NextResponse.json({
            success: true,
            message: 'Passkey removed successfully'
        })
    } catch (error: any) {
        console.error('Passkey deletion error:', error)
        return NextResponse.json({ error: error.message || 'Failed to delete passkey' }, { status: 500 })
    }
}

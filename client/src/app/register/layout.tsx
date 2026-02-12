import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Account',
    description: 'Join AgrowCart as a farmer, buyer, or delivery partner. Sign up to access AI-powered millet insights, marketplace, and direct farm-to-fork connectivity.',
    openGraph: {
        title: 'Create Account | AgrowCart',
        description: 'Join AgrowCart to access AI-powered millet insights and the marketplace.',
    },
}

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

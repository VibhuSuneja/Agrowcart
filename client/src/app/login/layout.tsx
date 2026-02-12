import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Secure Access',
    description: 'Sign in to AgrowCart to manage your millet value chain, track orders, and access AI-driven agricultural insights.',
    openGraph: {
        title: 'Sign In | AgrowCart',
        description: 'Sign in to AgrowCart — AI-powered millet marketplace and farming tools.',
    },
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

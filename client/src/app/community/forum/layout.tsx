import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Community Forum',
    description: 'Join the AgrowCart farmer community. Ask questions, share millet farming tips, get AI-drafted answers, and connect with agricultural experts across India.',
    openGraph: {
        title: 'Community Forum | AgrowCart',
        description: 'Connect with millet farmers and agricultural experts in the AgrowCart community.',
    },
}

export default function ForumLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

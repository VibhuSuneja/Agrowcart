import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Shree Anna — Millets of India',
    description: 'Discover the heritage of Indian millets (Shree Anna). Learn about ragi, jowar, bajra, and more — their nutritional benefits, recipes, and cultural significance.',
    openGraph: {
        title: 'Shree Anna — Millets of India | AgrowCart',
        description: 'Explore the rich heritage and nutritional power of Indian millets.',
    },
}

export default function ShreeAnnaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

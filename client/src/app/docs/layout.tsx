import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'API Docs',
    description: 'AgrowCart API documentation. Explore endpoints, authentication, and integration guides for the millet value chain platform.',
    openGraph: {
        title: 'API Docs | AgrowCart',
        description: 'API documentation for integrating with the AgrowCart platform.',
    },
}

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

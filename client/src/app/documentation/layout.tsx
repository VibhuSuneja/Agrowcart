import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Documentation',
    description: 'Technical documentation and API reference for the AgrowCart platform. Guides for developers, integrators, and platform contributors.',
    openGraph: {
        title: 'Documentation | AgrowCart',
        description: 'Technical documentation for the AgrowCart platform.',
    },
}

export default function DocumentationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

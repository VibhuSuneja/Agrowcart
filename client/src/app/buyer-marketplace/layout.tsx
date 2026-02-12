import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Buyer Marketplace',
    description: 'Source premium millets in bulk directly from verified farmers. Access wholesale pricing, quality certificates, and farm-to-factory traceability on AgrowCart.',
    openGraph: {
        title: 'Buyer Marketplace | AgrowCart',
        description: 'Wholesale millet sourcing with AI-powered quality assurance.',
    },
}

export default function BuyerMarketplaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Product Details',
    description: 'View detailed product information on AgrowCart. See pricing, quality analysis, seller details, and reviews for millet products.',
    openGraph: {
        title: 'Product Details | AgrowCart',
        description: 'Detailed millet product information with AI-powered quality analysis.',
    },
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Market Insights',
    description: 'Get AI-powered market analysis for millet crops. Discover price trends, demand forecasts, and strategic selling recommendations powered by AgrowCart intelligence.',
    openGraph: {
        title: 'AI Market Insights | AgrowCart',
        description: 'AI-powered market intelligence for millet farming and trading.',
    },
}

export default function AIInsightsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

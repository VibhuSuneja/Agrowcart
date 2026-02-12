import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Order Traceability',
    description: 'Trace your millet order from farm to fork on AgrowCart. View the complete supply chain journey — from harvest to your doorstep — with blockchain-verified transparency.',
    openGraph: {
        title: 'Order Traceability | AgrowCart',
        description: 'Farm-to-fork traceability for your millet orders on AgrowCart.',
    },
}

export default function TraceabilityLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

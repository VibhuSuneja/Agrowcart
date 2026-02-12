import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contract Hub',
    description: 'Manage agricultural contracts on AgrowCart. Create, sign, and track buyer-farmer agreements with transparent terms and secure digital signatures.',
    openGraph: {
        title: 'Contract Hub | AgrowCart',
        description: 'Digital agricultural contract management for farmers and buyers.',
    },
}

export default function ContractHubLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

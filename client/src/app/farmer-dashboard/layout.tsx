import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Farmer Dashboard',
    description: 'Manage your harvests, get AI-powered price predictions, analyze crop quality, track orders, and access government schemes — all from your AgrowCart farmer dashboard.',
    openGraph: {
        title: 'Farmer Dashboard | AgrowCart',
        description: 'AI-powered tools for millet farmers — price predictions, crop analysis, and digital ledger.',
    },
}

export default function FarmerDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

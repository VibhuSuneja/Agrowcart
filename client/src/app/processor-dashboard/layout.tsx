import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Processor Dashboard',
    description: 'Manage your millet processing operations on AgrowCart. Track raw material sourcing, processing batches, and value-added product distribution.',
    openGraph: {
        title: 'Processor Dashboard | AgrowCart',
        description: 'Millet processing management tools on AgrowCart.',
    },
}

export default function ProcessorDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

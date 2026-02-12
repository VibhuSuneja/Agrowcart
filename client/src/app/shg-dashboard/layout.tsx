import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Self-Help Group Dashboard',
    description: 'Manage your Self-Help Group operations on AgrowCart. Track collective harvests, coordinate with farmers, and access government support programs.',
    openGraph: {
        title: 'SHG Dashboard | AgrowCart',
        description: 'Self-Help Group management tools for collective millet farming.',
    },
}

export default function SHGDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

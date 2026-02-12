import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Startup Dashboard',
    description: 'Build your agri-tech startup on AgrowCart. Access millet market data, investor tools, portfolio management, and pitch deck creation.',
    openGraph: {
        title: 'Startup Dashboard | AgrowCart',
        description: 'Agri-tech startup tools — market analytics, investor connections, and pitch creation.',
    },
}

export default function StartupDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Delivery Dashboard',
    description: 'Manage your delivery missions, accept orders, verify deliveries with OTP, and track your earnings on the AgrowCart delivery partner dashboard.',
    openGraph: {
        title: 'Delivery Dashboard | AgrowCart',
        description: 'Real-time delivery mission control for AgrowCart delivery partners.',
    },
}

export default function DeliveryDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

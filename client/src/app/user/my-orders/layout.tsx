import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Orders',
    description: 'Track all your AgrowCart orders. View order status, delivery updates, download invoices, and manage your purchase history.',
    openGraph: {
        title: 'My Orders | AgrowCart',
        description: 'Track your AgrowCart orders and download invoices.',
    },
}

export default function MyOrdersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

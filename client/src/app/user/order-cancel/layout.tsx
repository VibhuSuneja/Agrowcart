import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Order Cancelled',
    description: 'Your AgrowCart order payment was cancelled. You can retry the payment or explore other products on the marketplace.',
}

export default function OrderCancelLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

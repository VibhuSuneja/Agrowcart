import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Order Successful',
    description: 'Your AgrowCart order has been placed successfully! Track your order delivery status and estimated arrival time.',
}

export default function OrderSuccessLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

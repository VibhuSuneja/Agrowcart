import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Track Order',
    description: 'Track your AgrowCart order in real-time. View delivery partner location, estimated arrival, and order status updates.',
}

export default function TrackOrderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

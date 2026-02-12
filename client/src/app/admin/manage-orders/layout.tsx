import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin — Manage Orders',
    description: 'View and manage all marketplace orders. Track order statuses, assign delivery partners, and handle customer inquiries from the admin panel.',
}

export default function ManageOrdersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

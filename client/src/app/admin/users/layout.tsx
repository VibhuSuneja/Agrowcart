import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin — User Management',
    description: 'Manage AgrowCart platform users. Ban or unban accounts, verify farmer status, view user details, and moderate the community.',
}

export default function UsersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

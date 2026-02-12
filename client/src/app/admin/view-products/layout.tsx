import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin — View Products',
    description: 'Browse and manage all product listings on the AgrowCart marketplace. Edit, remove, or feature millet products from the admin panel.',
}

export default function ViewProductsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

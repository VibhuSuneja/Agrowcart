import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin — Add Product',
    description: 'Add new millet products to the AgrowCart marketplace. Set pricing, upload images, define categories, and publish listings.',
}

export default function AddProductLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Shopping Cart',
    description: 'Review your AgrowCart shopping cart. View selected millet products, adjust quantities, and proceed to secure checkout.',
    openGraph: {
        title: 'Shopping Cart | AgrowCart',
        description: 'Review and manage items in your AgrowCart shopping cart.',
    },
}

export default function CartLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

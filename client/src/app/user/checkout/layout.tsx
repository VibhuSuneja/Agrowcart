import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your millet order on AgrowCart. Select delivery address, choose payment method (Razorpay or COD), and confirm your purchase.',
    openGraph: {
        title: 'Checkout | AgrowCart',
        description: 'Secure checkout for your AgrowCart millet order.',
    },
}

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

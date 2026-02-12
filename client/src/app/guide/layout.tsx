import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'User Guide',
    description: 'Learn how to use AgrowCart effectively. Step-by-step guides for farmers, buyers, and delivery partners — from registration to order fulfilment.',
    openGraph: {
        title: 'User Guide | AgrowCart',
        description: 'Comprehensive guides for using the AgrowCart millet marketplace.',
    },
}

export default function GuideLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Nutritionist',
    description: 'Get personalized millet-based nutrition advice powered by AI. Discover the health benefits of millets and create customized diet plans for your wellness goals.',
    openGraph: {
        title: 'AI Nutritionist | AgrowCart',
        description: 'Personalized millet-based nutrition and diet planning with AI.',
    },
}

export default function NutritionistLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Millet Recipes',
    description: 'Explore delicious and healthy millet recipes on AgrowCart. Discover traditional and modern dishes made with ragi, jowar, bajra, and other supergrains.',
    openGraph: {
        title: 'Millet Recipes | AgrowCart',
        description: 'Healthy and delicious millet recipes — from traditional to modern cuisine.',
    },
}

export default function RecipesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

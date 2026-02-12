import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Recipes',
    description: 'Browse your saved millet recipes on AgrowCart. Access cooking instructions, nutritional info, and ingredient lists for your favourite millet dishes.',
}

export default function UserRecipesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Account Settings',
    description: 'Manage your AgrowCart profile, update your display name, bio, profile image, and security settings including passkey authentication.',
    openGraph: {
        title: 'Account Settings | AgrowCart',
        description: 'Manage your AgrowCart profile and security settings.',
    },
}

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

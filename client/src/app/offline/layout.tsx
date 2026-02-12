import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'You Are Offline',
    description: 'You are currently offline. AgrowCart requires an internet connection for full functionality. Some cached pages may still be available.',
}

export default function OfflineLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

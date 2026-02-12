import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Reset your AgrowCart account password securely. Create a new password to regain access to your millet marketplace account.',
}

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

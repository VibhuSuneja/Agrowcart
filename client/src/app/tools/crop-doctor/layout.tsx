import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Crop Doctor',
    description: 'Diagnose crop health issues with AI-powered image analysis. Upload photos of your millet crops and get instant disease identification and treatment recommendations.',
    openGraph: {
        title: 'Crop Doctor | AgrowCart',
        description: 'AI-powered crop health diagnosis — upload a photo and get instant treatment advice.',
    },
}

export default function CropDoctorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

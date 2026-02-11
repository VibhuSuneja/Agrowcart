import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'AgrowCart | AI-Driven Millets Value Chain',
        short_name: 'AgrowCart',
        description: 'Connecting farmers to consumers with AI-powered Millet Value Chain.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#066046',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-maskable-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            }
        ],
        screenshots: [
            {
                src: '/screenshot-mobile.png',
                sizes: '1080x1920',
                type: 'image/png',
                form_factor: 'narrow',
            },
            {
                src: '/screenshot-desktop.png',
                sizes: '1920x1080',
                type: 'image/png',
                form_factor: 'wide',
            }
        ]
    }
}

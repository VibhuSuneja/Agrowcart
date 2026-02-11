'use client'

import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setIsInstallable(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstallable(false)
        }

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            setIsInstallable(false)
        }

        setDeferredPrompt(null)
    }

    if (!isInstallable) return null

    return (
        <button
            onClick={handleInstall}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
        >
            <Download size={16} />
            <span className="hidden sm:inline">Install App</span>
        </button>
    )
}

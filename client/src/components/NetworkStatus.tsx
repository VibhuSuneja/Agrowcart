'use client'
import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import toast from 'react-hot-toast'

export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        // Set initial status
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            toast.success('Back online!', { icon: '✅' })
        }

        const handleOffline = () => {
            setIsOnline(false)
            toast.error('You are offline', { icon: '📶', duration: Infinity })
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold"
                >
                    <WifiOff size={20} />
                    <span>No Internet Connection</span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

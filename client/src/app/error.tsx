'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('CRITICAL APP ERROR:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-xl w-full bg-white dark:bg-zinc-900 rounded-[3rem] p-12 text-center shadow-2xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden"
            >
                {/* Abstract Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />

                <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertTriangle className="text-red-600 dark:text-red-400" size={48} />
                </div>

                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
                    Something went wrong
                </h1>

                <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-12 text-lg">
                    We encountered an unexpected error while processing your request. Our team has been notified.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => reset()}
                        className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors"
                    >
                        <RefreshCcw size={16} />
                        Try Again
                    </motion.button>

                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <Home size={16} />
                            Back to Home
                        </motion.button>
                    </Link>
                </div>

                <div className="mt-12 pt-12 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 italic">
                        Reference ID: {error.digest || 'INTERNAL_SERVER_ERROR'}
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

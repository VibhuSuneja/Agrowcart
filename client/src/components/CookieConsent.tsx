'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Cookie, X, Check, Shield } from 'lucide-react'
import Link from 'next/link'

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent')
        if (!consent) {
            // Small delay before showing to avoid layout shift
            const timer = setTimeout(() => setShowBanner(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted')
        localStorage.setItem('cookie_consent_date', new Date().toISOString())
        closeWithAnimation()
    }

    const handleReject = () => {
        localStorage.setItem('cookie_consent', 'rejected')
        localStorage.setItem('cookie_consent_date', new Date().toISOString())
        // Clear any non-essential cookies here if needed
        closeWithAnimation()
    }

    const closeWithAnimation = () => {
        setIsClosing(true)
        setTimeout(() => setShowBanner(false), 300)
    }

    if (!showBanner) return null

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 ${isClosing ? 'pointer-events-none' : ''}`}
                >
                    <div className="max-w-4xl mx-auto bg-zinc-900 text-white rounded-3xl shadow-2xl shadow-black/20 border border-zinc-800 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-500/10 rounded-2xl shrink-0">
                                    <Cookie className="text-green-400" size={28} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield size={16} className="text-green-400" />
                                        <h3 className="text-lg font-black tracking-tight">Your Privacy Matters</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                        We use essential cookies to ensure our platform functions correctly, and optional cookies for language translation (Google Translate).
                                        By clicking &quot;Accept&quot;, you consent to our use of cookies as described in our{' '}
                                        <Link href="/privacy" className="text-green-400 hover:underline font-semibold">Privacy Policy</Link>.
                                    </p>

                                    <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                                        <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-2">Cookies We Use</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold">Session (Essential)</span>
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold">Google Translate (Optional)</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleAccept}
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-green-600/20"
                                        >
                                            <Check size={18} />
                                            Accept All
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all duration-200 border border-zinc-700"
                                        >
                                            <X size={18} />
                                            Essential Only
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DPDP Compliance Notice */}
                        <div className="bg-zinc-800/50 px-6 py-3 border-t border-zinc-800">
                            <p className="text-[9px] text-zinc-500 text-center">
                                Compliant with India&apos;s Digital Personal Data Protection Act (DPDP) 2023 •
                                <Link href="/privacy" className="hover:text-green-400 ml-1">Learn More</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CookieConsent

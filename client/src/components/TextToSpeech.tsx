'use client'
import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import toast from 'react-hot-toast'

export default function TextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [loading, setLoading] = useState(false)
    const [supported, setSupported] = useState(true)

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.speechSynthesis) {
            setSupported(false)
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.speechSynthesis.cancel()
            }
        }
    }, [])

    const getLanguageTag = () => {
        if (typeof document === 'undefined') return 'en-US'

        // Check Google Translate cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('googtrans='))
            ?.split('=')[1]

        if (cookieValue) {
            const lang = cookieValue.split('/').pop()
            const mapping: { [key: string]: string } = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'ta': 'ta-IN',
                'te': 'te-IN',
                'kn': 'kn-IN',
                'mr': 'mr-IN',
                'pa': 'pa-IN',
                'gu': 'gu-IN',
                'bn': 'bn-IN'
            }
            return mapping[lang || 'en'] || 'en-US'
        }

        return document.documentElement.lang || 'en-US'
    }

    const toggleSpeech = () => {
        if (!supported) {
            toast.error("Speech synthesis is not supported in this browser.")
            return
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
            return
        }

        // Get content from main container
        const mainContent = document.getElementById('main-content')
        if (!mainContent) {
            toast.error("Couldn't find content to read.")
            return
        }

        // Extract text and clean it
        // We clone to avoid modifying the actual page UI
        const clone = mainContent.cloneNode(true) as HTMLElement
        // Remove nav, footer, and scripts from extraction
        clone.querySelectorAll('nav, footer, script, style, .sr-only').forEach(el => el.remove())

        const text = clone.innerText
            .replace(/\s+/g, ' ')
            .trim()

        if (!text || text.length < 5) {
            toast.error("No significant text found on this page.")
            return
        }

        setLoading(true)

        const langTag = getLanguageTag()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = langTag

        // Match voice based on current language
        const voices = window.speechSynthesis.getVoices()
        const voice = voices.find(v => v.lang === langTag || v.lang.startsWith(langTag.split('-')[0]))
            || voices.find(v => v.lang.startsWith('en'))

        if (voice) utterance.voice = voice

        utterance.rate = 0.95 // Slightly slower for better clarity in regional languages
        utterance.pitch = 1.0

        utterance.onstart = () => {
            setLoading(false)
            setIsSpeaking(true)
        }

        utterance.onend = () => {
            setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
            console.error("Speech Error:", event)
            setIsSpeaking(false)
            setLoading(false)
            if (event.error !== 'interrupted') {
                toast.error("An error occurred during speech synthesis.")
            }
        }

        window.speechSynthesis.speak(utterance)
    }

    if (!supported) return null

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSpeech}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all shadow-sm border group relative overflow-hidden
                    ${isSpeaking
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white/50 backdrop-blur-md border-zinc-200/50 hover:bg-white hover:border-zinc-300 text-zinc-700'
                    }
                `}
                title={isSpeaking ? "Stop Listening" : "Listen to Page"}
                aria-label={isSpeaking ? "Stop reading page content" : "Listen to page content"}
            >
                {/* Background pulse when active */}
                {isSpeaking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-red-400"
                    />
                )}

                <div className={`relative z-10 p-1 rounded-lg transition-transform
                    ${isSpeaking ? 'bg-red-100 text-red-600' : 'bg-green-50 text-green-600 group-hover:scale-110'}
                `}>
                    {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : isSpeaking ? (
                        <VolumeX size={16} />
                    ) : (
                        <Volume2 size={16} />
                    )}
                </div>

                <span className="relative z-10 text-[9px] font-black uppercase tracking-widest hidden lg:block">
                    {isSpeaking ? "Stop" : "Listen to page"}
                </span>

                {isSpeaking && (
                    <div className="flex gap-0.5 ml-1">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, 12, 4] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                className="w-1 bg-red-500 rounded-full"
                            />
                        ))}
                    </div>
                )}
            </motion.button>
        </div>
    )
}

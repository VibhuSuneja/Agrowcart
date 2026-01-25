'use client'
import React, { useEffect, useState } from 'react'
import { Languages, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
    { code: 'kn', label: 'Kannada' },
    { code: 'mr', label: 'Marathi' },
    { code: 'pa', label: 'Punjabi' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'bn', label: 'Bengali' },
]

export default function GoogleTranslator() {
    const [selectedLang, setSelectedLang] = useState('en')
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // Define the initialization function
        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,ta,te,kn,mr,pa,gu,bn',
                    layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                'google_translate_element'
            )
        }

        // Load the script
        const existingScript = document.querySelector('script[src*="translate.google.com"]')
        if (!existingScript) {
            const script = document.createElement('script')
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            script.async = true
            document.body.appendChild(script)
        } else if ((window as any).google && (window as any).google.translate) {
            (window as any).googleTranslateElementInit()
        }

        // ---------------------------------------------------------
        // "NUCLEAR" OPTION: MutationObserver to kill the banner
        // ---------------------------------------------------------
        const observer = new MutationObserver((mutations) => {
            const banner = document.querySelector('.goog-te-banner-frame')
            const bannerFrame = document.querySelector('iframe.goog-te-banner-frame')

            if (banner || bannerFrame) {
                if (banner) banner.remove()
                if (bannerFrame) bannerFrame.remove()
                document.body.style.top = '0px'
                document.body.style.marginTop = '0px'
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })

        // Check for existing cookie to update UI state
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`
            const parts = value.split(`; ${name}=`)
            if (parts.length === 2) return parts.pop()?.split(';').shift()
        }

        // Try to sync with existing selection
        const timer = setTimeout(() => {
            const cookieVal = getCookie('googtrans')
            if (cookieVal) {
                const lang = cookieVal.split('/').pop()
                if (lang && LANGUAGES.some(l => l.code === lang)) {
                    setSelectedLang(lang)
                }
            }
        }, 1000)

        return () => {
            clearTimeout(timer)
            observer.disconnect()
        }
    }, [])

    const handleLanguageChange = (langCode: string) => {
        setSelectedLang(langCode)
        setIsOpen(false)

        try {
            const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
            if (selectElement) {
                selectElement.value = langCode
                selectElement.dispatchEvent(new Event('change'))
            } else {
                // Fallback: Set cookie and reload if the standard element isn't there
                const domain = window.location.hostname === 'localhost' ? '' : `domain=${window.location.hostname};`
                document.cookie = `googtrans=/en/${langCode}; path=/; ${domain}`
                document.cookie = `googtrans=/en/${langCode}; path=/;`
                window.location.reload()
            }
        } catch (error) {
            console.error("Translation error:", error)
        }
    }

    const currentLabel = LANGUAGES.find(l => l.code === selectedLang)?.label || 'English'

    return (
        <div className="relative z-50">
            {/* Global Styles to hide Google UI but keep it functional */}
            {/* Global Styles to hide Google UI but keep it functional */}
            <style jsx global>{`
                /* Hide the top banner (older & newer versions) */
                .goog-te-banner-frame,
                iframe.goog-te-banner-frame,
                .skiptranslate.goog-te-banner-frame { 
                    display: none !important; 
                    visibility: hidden !important;
                    height: 0 !important;
                    width: 0 !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                
                /* Hide the modern "VIpgJd" flex banner */
                .VIpgJd-ZVi9od-ORHb-OEVmcd {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                }
                
                /* Hide the standard widget container visually */
                #google_translate_element { 
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    overflow: hidden;
                    clip: rect(1px, 1px, 1px, 1px);
                    opacity: 0;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                }
                
                /* Hide tooltips and popups */
                .goog-tooltip, .goog-te-balloon-frame { 
                    display: none !important; 
                    visibility: hidden !important;
                }
                
                /* Remove text highlighting */
                .goog-text-highlight { 
                    background-color: transparent !important; 
                    box-shadow: none !important; 
                }
                
                /* Reset Body & HTML Shift */
                body, html { 
                    top: 0px !important; 
                    margin-top: 0px !important;
                    position: static !important;
                }
                
                /* Hide google icon in widget */
                .goog-te-gadget-icon {
                    display: none !important;
                }
            `}</style>

            {/* The Widget Container (Hidden but Present) */}
            <div id="google_translate_element" />

            {/* Custom Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/50 backdrop-blur-md hover:bg-white border border-zinc-200/50 hover:border-zinc-300 px-3 py-2 rounded-xl transition-all shadow-sm group"
            >
                <div className="p-1 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Languages size={16} />
                </div>
                <span className="text-sm font-semibold text-zinc-700">{currentLabel}</span>
                <ChevronDown
                    size={14}
                    className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Animated Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-zinc-900/10 border border-zinc-100 overflow-hidden z-50 py-1"
                        >
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between hover:bg-zinc-50 transition-colors
                                        ${selectedLang === lang.code ? 'text-green-600 bg-green-50/50' : 'text-zinc-600'}
                                    `}
                                >
                                    {lang.label}
                                    {selectedLang === lang.code && <Check size={14} />}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

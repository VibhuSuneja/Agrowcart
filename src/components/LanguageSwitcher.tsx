'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { locales, localeNames, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = localeNames[locale];

    const handleLanguageChange = (newLocale: Locale) => {
        setLocale(newLocale);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Language Selector Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 border border-white/20"
                aria-label="Select Language"
            >
                <Languages className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">{currentLanguage.native}</span>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        >
                            <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 px-3 py-2">
                                    <Languages className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Select Language
                                    </span>
                                </div>
                            </div>

                            <div className="max-h-80 overflow-y-auto p-1">
                                {locales.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${locale === lang
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            } cursor-pointer`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{getLanguageFlag(lang)}</span>
                                            <div className="text-left">
                                                <div className={`font-semibold ${locale === lang ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                                    {localeNames[lang].native}
                                                </div>
                                                <div className={`text-xs ${locale === lang ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {localeNames[lang].english}
                                                </div>
                                            </div>
                                        </div>
                                        {locale === lang && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            >
                                                <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                    Language preference saved
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper function to get flag emoji
function getLanguageFlag(code: string): string {
    const flags: Record<string, string> = {
        en: '🇬🇧',
        hi: '🇮🇳',
        ta: '🇮🇳',
        te: '🇮🇳',
        kn: '🇮🇳',
        mr: '🇮🇳',
    };
    return flags[code] || '🌐';
}

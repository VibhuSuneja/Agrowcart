'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Locale } from './config';
import { defaultLocale } from './config';

type Messages = Record<string, any>;

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, variables?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import enMessages from '../../messages/en.json';

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale);
    const [messages, setMessages] = useState<Messages>(enMessages);

    // Load messages when locale changes
    useEffect(() => {
        if (locale === 'en') {
            setMessages(enMessages);
            return;
        }
        const loadMessages = async () => {
            try {
                const msgs = await import(`../../messages/${locale}.json`);
                setMessages(msgs.default);
            } catch (error) {
                console.error(`Failed to load messages for locale: ${locale}`, error);
                // Fallback to English
                setMessages(enMessages);
            }
        };
        loadMessages();
    }, [locale]);

    // Load locale from localStorage on mount
    useEffect(() => {
        const savedLocale = localStorage.getItem('preferred-locale') as Locale;
        if (savedLocale && ['en', 'hi', 'ta', 'te', 'kn', 'mr'].includes(savedLocale)) {
            setLocaleState(savedLocale);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('preferred-locale', newLocale);
    };

    // Translation function with nested key support and variable interpolation
    const t = (key: string, variables?: Record<string, any>): string => {
        const keys = key.split('.');
        let value: any = messages;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key; // Return the key itself if not found
            }
        }

        if (typeof value !== 'string') {
            console.warn(`Translation value is not a string: ${key}`);
            return key;
        }

        // Replace variables like {name}, {count}
        if (variables) {
            return value.replace(/\{(\w+)\}/g, (match, varName) => {
                return variables[varName] !== undefined ? String(variables[varName]) : match;
            });
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Hook for scoped translations (similar to next-intl's useTranslations)
export function useTranslations(namespace?: string) {
    const { t } = useLanguage();

    return (key: string, variables?: Record<string, any>) => {
        const fullKey = namespace ? `${namespace}.${key}` : key;
        return t(fullKey, variables);
    };
}

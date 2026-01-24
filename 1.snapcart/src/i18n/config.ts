export const locales = ['en', 'hi', 'ta', 'te', 'kn', 'mr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, { native: string; english: string }> = {
    en: { native: 'English', english: 'English' },
    hi: { native: 'हिंदी', english: 'Hindi' },
    ta: { native: 'தமிழ்', english: 'Tamil' },
    te: { native: 'తెలుగు', english: 'Telugu' },
    kn: { native: 'ಕನ್ನಡ', english: 'Kannada' },
    mr: { native: 'मराठी', english: 'Marathi' },
};

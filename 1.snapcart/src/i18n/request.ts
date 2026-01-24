import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'hi', 'ta', 'te', 'kn', 'mr'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale: requestLocale }) => {
    const locale = await requestLocale;
    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as Locale)) notFound();

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});

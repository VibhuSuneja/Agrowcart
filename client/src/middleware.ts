import { auth } from "@/auth"
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

const i18nMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales,
    // Used when no locale matches
    defaultLocale: 'en',
    // Automatically detect locale from user's browser
    localeDetection: true,
    // Always use a locale prefix
    localePrefix: 'as-needed'
});

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;

    // Protect Admin Dashboard
    if (pathname.startsWith('/admin')) {
        if (!isLoggedIn) {
            return Response.redirect(new URL('/login', nextUrl));
        }
        // Strict Role Check for Admin Routes
        if (req.auth?.user?.role !== 'admin') {
            return Response.redirect(new URL('/', nextUrl)); // Redirect unauthorized users to home
        }
    }

    // Protect Other Dashboards
    if (
        pathname.includes('-dashboard') ||
        pathname.startsWith('/delivery') ||
        pathname.startsWith('/buyer-marketplace')
    ) {
        if (!isLoggedIn) {
            return Response.redirect(new URL('/login', nextUrl));
        }
    }

    // Allow unrestricted access to public routes, but run i18n middleware
    return i18nMiddleware(req);
})

export const config = {
    // combine both matchers: i18n and protected routes
    matcher: ['/', '/(hi|ta|te|kn|mr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};

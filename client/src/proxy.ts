import { auth } from "@/auth"
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;

    // Skip middleware for internal Vercel/Next.js paths if matcher somehow misses them
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Protect Admin Dashboard
    if (pathname.startsWith('/admin')) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }
        // Strict Role Check for Admin Routes
        if (req.auth?.user?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', nextUrl)); // Redirect unauthorized users to home
        }
    }

    // Protect Other Dashboards
    if (
        pathname.includes('-dashboard') ||
        pathname.startsWith('/delivery') ||
        pathname.startsWith('/buyer-marketplace') ||
        pathname.startsWith('/user')
    ) {
        if (!isLoggedIn && pathname !== '/login' && pathname !== '/register') {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

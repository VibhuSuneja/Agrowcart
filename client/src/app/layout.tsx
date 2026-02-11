
import type { Metadata } from "next";

import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";
import { Toaster } from 'react-hot-toast';
import GlobalChatBot from "@/components/GlobalChatBot";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAds from "@/components/GoogleAds";
import { Analytics } from "@vercel/analytics/next"
import { SocketProvider } from "@/context/SocketContext";
import CookieConsent from "@/components/CookieConsent";
import NetworkStatus from "@/components/NetworkStatus";
import BottomNav from "@/components/BottomNav";
import { orbitron, jakarta } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.agrowcart.com'),
  title: {
    default: "AgrowCart | AI-Driven Millets Value Chain Platform",
    template: "%s | AgrowCart"
  },
  description: "Empowering farmers and buyers with AI-driven millet insights, market price predictions, and direct farm-to-fork connectivity.",
  keywords: ["millets", "agriculture", "farmer", "marketplace", "AI", "crop analysis", "price prediction", "smart farming", "traceability"],
  authors: [{ name: "AgrowCart Team" }],
  creator: "AgrowCart Team",
  publisher: "AgrowCart",
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: "AgrowCart | AI-Driven Millets Value Chain Platform",
    description: "Connect directly with millet farmers, access AI-powered crop insights, and explore value-added millet products.",
    url: 'https://agrowcart.vercel.app',
    siteName: 'AgrowCart',
    images: [
      {
        url: '/logo.jpg', // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: 'AgrowCart Platform Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AgrowCart | AI-Driven Millets Value Chain Platform",
    description: "Empowering farmers and buyers with AI-driven millet insights and direct connectivity.",
    creator: "@agrowcart",
    images: ['/logo.jpg'],
  },
  themeColor: '#066046',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children, }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${orbitron.variable} w-full min-h-screen bg-white dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-300 selection:bg-primary selection:text-white font-sans`} suppressHydrationWarning>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}

        {/* Google Ads */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
          <GoogleAds GOOGLE_ADS_ID={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID} />
        )}

        <Provider>
          <SocketProvider>
            <StoreProvider>
              <LanguageProvider>
                <InitUser />
                {/* Skip to Main Content for Accessibility */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:shadow-2xl focus:font-bold focus:outline-none"
                >
                  Skip to main content
                </a>

                <Toaster position="top-right" />
                <GlobalChatBot />
                <BottomNav />
                <NetworkStatus />

                <main id="main-content" className="relative outline-none" tabIndex={-1}>
                  {children}
                </main>
                <Analytics />
              </LanguageProvider>
            </StoreProvider>
          </SocketProvider>
          <CookieConsent />
        </Provider>
      </body>
    </html>
  );
}


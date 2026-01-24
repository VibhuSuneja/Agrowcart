
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

export const metadata: Metadata = {
  metadataBase: new URL('https://agrowcart.vercel.app'), // Replace with actual domain
  title: {
    default: "AgrowCart | AI-Driven Millets Value Chain Platform",
    template: "%s | AgrowCart"
  },
  description: "Empowering farmers and buyers with AI-driven millet insights, market price predictions, and direct farm-to-fork connectivity.",
  keywords: ["millets", "agriculture", "farmer", "marketplace", "AI", "crop analysis", "price prediction", "smart farming", "sih", "traceability"],
  authors: [{ name: "AgrowCart Team" }],
  creator: "AgrowCart Team",
  publisher: "AgrowCart",
  manifest: "/manifest.json",
  openGraph: {
    title: "AgrowCart | AI-Driven Millets Value Chain Platform",
    description: "Connect directly with millet farmers, access AI-powered crop insights, and explore value-added millet products.",
    url: 'https://agrowcart.vercel.app',
    siteName: 'AgrowCart',
    images: [
      {
        url: '/og-image.png', // Ensure this image exists in public folder
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
    images: ['/og-image.png'],
  },
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
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-50 to-white" suppressHydrationWarning>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}

        {/* Google Ads */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
          <GoogleAds GOOGLE_ADS_ID={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID} />
        )}

        <Provider>
          <StoreProvider>
            <LanguageProvider>
              <InitUser />
              <Toaster position="top-right" />
              <GlobalChatBot />

              {children}
              <Analytics />
            </LanguageProvider>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}


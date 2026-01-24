
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

export const metadata: Metadata = {
  title: "AgrowCart | Farm-to-Fork Platform",
  description: "Empowering farmers and buyers with AI-driven millet insights.",
  manifest: "/manifest.json",
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
            </LanguageProvider>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}

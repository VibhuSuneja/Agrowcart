
import type { Metadata } from "next";

import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";
import { Toaster } from 'react-hot-toast';
import GlobalChatBot from "@/components/GlobalChatBot";




export const metadata: Metadata = {
  title: "Millets Value Chain | Farm-to-Fork Platform",
  description: "Empowering farmers and buyers with AI-driven millet insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-50 to-white" suppressHydrationWarning>
        <Provider>
          <StoreProvider>

            <InitUser />
            <Toaster position="top-right" />
            <GlobalChatBot />

            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}

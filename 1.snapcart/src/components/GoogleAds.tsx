'use client'

import Script from 'next/script'

export default function GoogleAds({ GOOGLE_ADS_ID }: { GOOGLE_ADS_ID: string }) {
    return (
        <>
            {/* Google Ads (AdSense) Script */}
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADS_ID}`}
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />

            {/* Google Ads Conversion Tracking */}
            <Script
                id="google-ads-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `,
                }}
            />
        </>
    )
}

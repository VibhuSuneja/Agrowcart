import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/farmer-dashboard/', '/buyer-dashboard/'],
        },
        sitemap: 'https://agrowcart.vercel.app/sitemap.xml',
    };
}

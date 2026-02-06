import { Orbitron, Plus_Jakarta_Sans } from 'next/font/google';

// Futuristic font for logo
export const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['700', '900'],
    variable: '--font-orbitron',
});

// Display font for headings and UI
export const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-jakarta',
});

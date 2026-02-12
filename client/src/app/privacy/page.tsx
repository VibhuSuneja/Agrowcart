import React from 'react';
import { Metadata } from 'next';
import { PrivacyContent } from '@/components/LegalContent';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Learn how AgrowCart collects, uses, and protects your personal data. Our privacy policy covers data handling, cookie use, and your rights as a platform user.',
    openGraph: {
        title: 'Privacy Policy | AgrowCart',
        description: 'Learn how AgrowCart collects, uses, and protects your personal data.',
    },
}

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 bg-white rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 mb-20 mt-10">
            <PrivacyContent />
        </div>
    );
};

export default PrivacyPolicy;

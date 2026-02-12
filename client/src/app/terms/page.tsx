import React from 'react';
import { Metadata } from 'next';
import { TermsContent } from '@/components/LegalContent';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Read the AgrowCart Terms of Service. Understand user obligations, platform rules, intellectual property, and dispute resolution for using the AgrowCart millet marketplace.',
    openGraph: {
        title: 'Terms of Service | AgrowCart',
        description: 'Read the AgrowCart Terms of Service governing use of the platform.',
    },
}

const TermsAndConditions = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 bg-white rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 mb-20 mt-10">
            <TermsContent />
        </div>
    );
};

export default TermsAndConditions;

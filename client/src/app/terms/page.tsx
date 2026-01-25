import React from 'react';
import { TermsContent } from '@/components/LegalContent';

const TermsAndConditions = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 bg-white rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 mb-20 mt-10">
            <TermsContent />
        </div>
    );
};

export default TermsAndConditions;

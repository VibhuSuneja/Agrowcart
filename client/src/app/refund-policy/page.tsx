import React from 'react';
import { RefundPolicyContent } from '@/components/RefundPolicyContent';

const RefundPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 bg-white rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 mb-20 mt-10">
            <RefundPolicyContent />
        </div>
    );
};

export default RefundPolicy;

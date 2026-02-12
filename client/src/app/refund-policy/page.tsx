import React from 'react';
import { Metadata } from 'next';
import { RefundPolicyContent } from '@/components/RefundPolicyContent';

export const metadata: Metadata = {
    title: 'Refund & Cancellation Policy',
    description: 'Understand the AgrowCart refund and cancellation policy. Know your rights regarding order returns, refund timelines, and eligible conditions for millet product orders.',
    openGraph: {
        title: 'Refund & Cancellation Policy | AgrowCart',
        description: 'Understand the AgrowCart refund and cancellation policy for orders.',
    },
}

const RefundPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 bg-white rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 mb-20 mt-10">
            <RefundPolicyContent />
        </div>
    );
};

export default RefundPolicy;

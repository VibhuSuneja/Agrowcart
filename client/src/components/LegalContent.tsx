import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
    type: 'terms' | 'privacy';
    onClose: () => void;
}

export const TermsContent = () => (
    <div className="prose prose-green max-w-none">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Terms of Service</h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6 border-b pb-4">Effective Date: January 25, 2026</p>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">01</span>
                Acceptance of Agreement
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs">
                By accessing AgrowCart ("the Platform"), you ("User", "Farmer", or "Buyer") enter into a legally binding agreement with AgrowCart. These terms govern your use of the marketplace, AI tools, and logistics services. Continued use constitutes irrevocable acceptance of these terms.
            </p>
        </section>

        <section className="mb-8 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center text-[10px]">02</span>
                AI Predictions & Liability Shield
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs mb-3">
                AgrowCart provide AI-driven market price simulations, demand heatmaps, and crop health analysis.
            </p>
            <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 text-[10px] font-medium text-zinc-700 space-y-2 shadow-sm">
                <p><strong>CRITICAL NOTICE:</strong> AI outputs are probabilistic simulations based on historical data. They do not constitute financial or legal advice.</p>
                <p>AgrowCart shall NOT be liable for any financial losses or crop failure resulting from reliance on AI-generated insights.</p>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">03</span>
                Marketplace & Transactions
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs">
                AgrowCart is a neutral marketplace. We facilitate connectivity but are not a party to the contract of sale unless specifically identified as a fulfillment partner.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">04</span>
                Binding Arbitration
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs mb-3">
                Disputes shall be subject to binding arbitration in Kurukshetra, Haryana, India.
            </p>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4">
            <div>
                <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Legal Representative</p>
                <p className="text-xs font-bold text-zinc-900">AgrowCart Legal Team</p>
            </div>
            <div>
                <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Support Contact</p>
                <p className="text-xs text-green-600 font-bold">vibhusun01@gmail.com</p>
                <p className="text-xs text-zinc-500 font-bold">+91 9468150076</p>
            </div>
        </div>
    </div>
);

export const PrivacyContent = () => (
    <div className="prose prose-green max-w-none">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Privacy Protocol</h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6 border-b pb-4">Last Updated: January 25, 2026</p>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">01</span>
                Data Stewardship
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs">
                We are committed to processing your agricultural and personal data with absolute transparency and for specified, lawful purposes only.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">02</span>
                What We Collect
            </h2>
            <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">Identity & Farm Data</p>
                    <p className="text-[10px] font-bold text-zinc-700">Name, Email, Mobile, Geo-location, Crop Variety, and Harvest Photos.</p>
                </div>
            </div>
        </section>

        <section className="mb-8 p-6 bg-zinc-900 rounded-3xl text-white">
            <h2 className="text-lg font-bold mb-3">🔒 Zero-Leak Promise</h2>
            <p className="text-zinc-400 text-[10px] leading-relaxed mb-4">
                We do not sell raw personal or agricultural data to any third-party marketing firms. Data sharing is strictly restricted to functional partners.
            </p>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Data Protection Officer</p>
            <p className="text-xs font-bold text-zinc-900">Vibhu Suneja (Founder)</p>
            <p className="text-xs text-green-600 font-bold">vibhusun01@gmail.com</p>
        </div>
    </div>
);

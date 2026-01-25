import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 prose prose-green bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 mb-20 mt-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Privacy Protocol</h1>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-10 border-b pb-6">Last Updated: January 25, 2026</p>

            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs">01</span>
                    Data Stewardship
                </h2>
                <p className="text-zinc-600 leading-relaxed text-sm">
                    AgrowCart acts as a **Data Fiduciary** under the Digital Personal Data Protection Act. We are committed to processing your agricultural and personal data with absolute transparency and for specified, lawful purposes only.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs">02</span>
                    Information Architecture
                </h2>
                <p className="text-zinc-600 leading-relaxed text-sm mb-4">We collect and process the following data categories:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Identity Data</p>
                        <p className="text-xs font-bold text-zinc-700">Legal Name, Verified Email, Mobile Number, and Secure Auth Credentials.</p>
                    </div>
                    <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Agricultural Data</p>
                        <p className="text-xs font-bold text-zinc-700">Farm Geo-location, Crop Variety, Harvest Photos (for AI Analysis), and yields.</p>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs">03</span>
                    Processing Purpose
                </h2>
                <ul className="space-y-4 text-sm text-zinc-600">
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <span>**Fulfillment:** To coordinate logistics between buyers and farmers.</span>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <span>**AI Optimization:** To train our neural networks for better regional crop health analysis.</span>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <span>**Market Trust:** To generate quality-verified "Blockchain Passports" for listed products.</span>
                    </li>
                </ul>
            </section>

            <section className="mb-10 p-8 bg-zinc-900 rounded-[2.5rem] text-white">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🔒 The "Zero-Leak" Promise
                </h2>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-medium">
                    We do not sell raw personal or agricultural data to any third-party marketing firms. Data sharing is strictly restricted to functional partners (e.g., payment gateways) or when mandated by the Government of India.
                </p>
                <div className="flex flex-wrap gap-2 text-[8px] font-black uppercase tracking-widest">
                    <span className="px-3 py-1 bg-white/10 rounded-full">AES-256 Encryption</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full">Secure JWT Auth</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full">Privacy by Design</span>
                </div>
            </section>

            <div className="mt-12 pt-10 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Data Protection Officer</p>
                        <p className="font-bold text-zinc-900">Vibhu Singh (Acting DPO)</p>
                        <p className="text-sm text-zinc-500">AgrowCart Intelligence Unit</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Privacy Hotline</p>
                        <a href="mailto:privacy@agrowcart.com" className="text-green-600 font-bold hover:underline font-mono">privacy@agrowcart.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

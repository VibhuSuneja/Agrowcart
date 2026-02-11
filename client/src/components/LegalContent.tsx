import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LegalModalProps {
    type: 'terms' | 'privacy';
    onClose: () => void;
}

export const TermsContent = () => (
    <div className="space-y-6">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Terms of Service</h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6 border-b pb-4">Effective Date: February 11, 2026 • AI Compliance Update</p>

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
                <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">02</span>
                AI Governance & SGI Disclosure
            </h2>
            <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                <p>
                    In compliance with the <strong>IndiaAI Governance Guidelines 2025</strong> and the <strong>IT (Amendment) Rules 2026</strong>, AgrowCart implements strict oversight for AI-driven insights and Synthetically Generated Information (SGI).
                </p>
                <div className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm space-y-2">
                    <p><strong>SIMULATION TRANSPARENCY:</strong> All price predictions and heatmaps are AI-generated probabilistic simulations. They are clearly labeled as "AI Insights" and do not constitute financial guarantees.</p>
                    <p><strong>SGI LABELING:</strong> Any content (images/text) generated or significantly altered by AI must be disclosed. Users are prohibited from removing mandatory metadata/watermarks from AI-generated outputs.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-[10px] font-bold text-red-700 uppercase tracking-tight">
                    DEEPFAKE & 3-HOUR TAKEDOWN: As per Feb 2026 regulations, any reported deepfake or impersonation content will be removed within a 3-hour window. Violations of SGI disclosure mandates will result in immediate safe-harbor forfeiture and account termination.
                </div>
            </div>
        </section>

        <section className="mb-8 overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">03</span>
                Digital Asset Authenticity
            </h2>
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 space-y-4">
                <p className="text-zinc-600 leading-relaxed text-xs">
                    All visual representations (photos/videos) of crop produce uploaded to the Platform must be <strong>original, genuine, and unmodified</strong>. By uploading an image, the User warrants that:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-zinc-700 font-medium">
                    <li>The photo is an actual representation of the item being listed.</li>
                    <li>No digital filters, AI enhancements, or editing software (Photoshop, etc.) have been used.</li>
                </ul>
                <div className="bg-white p-4 rounded-xl border-l-4 border-amber-500 text-[10px] font-medium text-zinc-700">
                    <strong>FORGERY PENALTY:</strong> Uploading fraudulent or modified images to deceive buyers is a violation of the Consumer Protection Act, 2019 and will result in immediate permanent account termination and forfeiture of pending payouts.
                </div>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">04</span>
                Marketplace & Transactions
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs">
                AgrowCart is a neutral marketplace. We facilitate connectivity but are not a party to the contract of sale unless specifically identified as a fulfillment partner.
            </p>
        </section>

        <section className="mb-8 bg-red-50 p-6 rounded-2xl border border-red-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center text-[10px]">05</span>
                Intellectual Property & Anti-Cloning
            </h2>
            <div className="space-y-3 text-xs text-zinc-700">
                <p>
                    <strong>Ownership:</strong> All source code, UI/UX designs, algorithms, datasets, trademarks, and content on AgrowCart are the exclusive intellectual property of <strong>Vibhu Suneja</strong> and are protected under the Indian Copyright Act, 1957 and Information Technology Act, 2000.
                </p>
                <p>
                    <strong>Prohibited Activities:</strong> The following are strictly prohibited without prior written consent:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Copying, cloning, or reverse-engineering any part of this platform</li>
                    <li>Automated scraping of prices, farmer data, or product listings</li>
                    <li>Using our branding, logos, or design patterns on derivative works</li>
                    <li>Redistributing or reselling any part of the platform&apos;s code</li>
                </ul>
                <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 mt-4">
                    <p className="font-bold text-red-700">⚠️ Legal Action Warning</p>
                    <p className="text-[10px] mt-1">
                        Violations will result in immediate DMCA takedown requests, criminal complaints under Section 66 of IT Act 2000, and civil suits for damages up to ₹50,00,000 (Fifty Lakhs) per infringement.
                    </p>
                </div>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">06</span>
                Agricultural Procurement & Edibility Standards
            </h2>
            <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                <p>
                    Farmers selling produce through AgrowCart-facilitated Mandi channels must comply with the <strong>Regulated Market Committee (APMC)</strong> norms and <strong>FSSAI 2023</strong> standards for "Nutri-Cereals".
                </p>
                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 space-y-3">
                    <p className="font-bold text-zinc-800 text-[10px] uppercase tracking-widest">Mandatory Documentation (Proof of Origin)</p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                        <li><strong>Identity:</strong> Valid Aadhaar Card linked to the registered mobile number.</li>
                        <li><strong>Land Records:</strong> Documentation of land ownership (Khasra/Girdawari) or registered lease.</li>
                        <li><strong>Financial:</strong> Bank Passbook/Statement for direct MSP (Minimum Support Price) transfers.</li>
                        <li><strong>Edibility Proof:</strong> Quality Testing Report from FSSAI-notified labs (for large batches/procurement).</li>
                    </ul>
                </div>
                <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 space-y-3">
                    <p className="font-bold text-green-800 text-[10px] uppercase tracking-widest">Edibility & Technical Quality (FSSAI 2023)</p>
                    <p>All Millet produce must meet the 8 key quality parameters:</p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px]">
                        <li><strong>Moisture:</strong> Maximum 13% m/m (Prevents mold/toxins).</li>
                        <li><strong>Purity:</strong> Extraneous matter (sand, stones) must not exceed 2%.</li>
                        <li><strong>Safety:</strong> Zero presence of prohibited pesticides and weevilled grains within tolerance limits.</li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">07</span>
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
    <div className="space-y-6">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Privacy Protocol</h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6 border-b pb-4">Last Updated: February 11, 2026 • DPDP Rules 2025 Compliant</p>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">01</span>
                Data Stewardship
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs">
                In accordance with the <strong>DPDP Rules 2025</strong>, AgrowCart processes your agricultural and personal data with explicit, informed, and granular consent. You may manage your consent through authorized <strong>Consent Managers</strong> as per Rule 4 of the DPDP Rules.
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

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">03</span>
                Data Retention Period
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs">
                Your personal data is retained for <strong>3 years</strong> from your last transaction or account activity. After this period, data is automatically anonymized or deleted unless required by law.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-[10px]">04</span>
                Third-Party Data Sharing
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="p-3 bg-zinc-50 rounded-lg text-center">
                    <p className="text-[8px] font-bold text-zinc-500">Payment</p>
                    <p className="text-[10px] font-black text-zinc-800">Stripe</p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg text-center">
                    <p className="text-[8px] font-bold text-zinc-500">Images</p>
                    <p className="text-[10px] font-black text-zinc-800">Cloudinary</p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg text-center">
                    <p className="text-[8px] font-bold text-zinc-500">AI Analysis</p>
                    <p className="text-[10px] font-black text-zinc-800">Google Gemini</p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg text-center">
                    <p className="text-[8px] font-bold text-zinc-500">Auth</p>
                    <p className="text-[10px] font-black text-zinc-800">Google OAuth</p>
                </div>
            </div>
        </section>

        <section className="mb-8 p-6 bg-zinc-900 rounded-3xl text-white">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-400" />
                Zero-Leak & Encryption Promise
            </h2>
            <div className="space-y-3 text-[10px] text-zinc-400 leading-relaxed">
                <p>
                    <strong>ENCRYPTION AT REST:</strong> All sensitive personal and agricultural data stored in our databases is encrypted using industry-standard <strong>AES-256</strong> algorithms.
                </p>
                <p>
                    <strong>SECURE TRANSMISSION:</strong> Data is transmitted over <strong>TLS 1.3</strong> protected channels, ensuring end-to-end security from your device to our "Safe Harbor" servers.
                </p>
                <p>
                    We do not sell raw personal data to any third-party marketing firms. Data sharing is strictly restricted to functional partners listed below.
                </p>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center text-[10px]">05</span>
                Your Rights (DPDP Act, 2023)
            </h2>
            <div className="space-y-2 text-xs text-zinc-600">
                <p>As a <strong>Data Principal</strong> under Indian law, you hold the following statutory rights:</p>
                <p><strong>Right to Summary:</strong> Obtain a summary of processed data and identities of sharing parties.</p>
                <p><strong>Right to Correction & Erasure:</strong> Correct inaccuracies or request permanent deletion of your account once processing purpose is fulfilled.</p>
                <p><strong>Right to Nominate:</strong> Nominate an individual to exercise your rights in case of death or incapacity.</p>
                <p><strong>Right to Grievance Redressal:</strong> Guaranteed response from our Data Protection Officer within 72 hours for all privacy-related queries.</p>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">06</span>
                Cross-Border Transfers
            </h2>
            <p className="text-zinc-600 leading-relaxed text-xs">
                In compliance with Section 16 of the DPDP Act, your data is primarily stored within the territory of India. Any cross-border transfers for AI processing (e.g., Google Gemini) are performed under strict data-sharing agreements that adhere to Indian security standards.
            </p>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Data Protection Officer</p>
            <p className="text-xs font-bold text-zinc-900">Vibhu Suneja (Founder)</p>
            <p className="text-xs text-green-600 font-bold">vibhusun01@gmail.com • Registered DPO under DPDP 2023</p>
        </div>
    </div>
);
export const LegalModal = ({ type, onClose }: LegalModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 rounded-full hover:bg-zinc-100 transition-colors z-20 group"
                >
                    <X size={20} className="text-zinc-400 group-hover:text-green-600 transition-colors" />
                </button>

                <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                    {type === 'terms' ? <TermsContent /> : <PrivacyContent />}
                </div>

                <div className="p-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-green-900/10 hover:shadow-green-900/20 active:scale-95 text-sm"
                    >
                        Accept & Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
};


import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 prose prose-green bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 mb-20 mt-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-10 border-b pb-6">Effective Date: January 25, 2026</p>

            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs">01</span>
                    Acceptance of Agreement
                </h2>
                <p className="text-zinc-600 leading-relaxed text-sm">
                    By accessing AgrowCart ("the Platform"), you ("User", "Farmer", or "Buyer") enter into a legally binding agreement with AgrowCart. These terms govern your use of the marketplace, AI tools, and logistics services. Continued use constitutes irrevocable acceptance of these terms.
                </p>
            </section>

            <section className="mb-10 bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-xs">02</span>
                    AI Predictions & Liability Shield
                </h2>
                <p className="text-zinc-600 leading-relaxed text-sm mb-4">
                    AgrowCart provide AI-driven market price simulations, demand heatmaps, and crop health analysis.
                </p>
                <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 text-xs font-medium text-zinc-700 space-y-3 shadow-sm">
                    <p><strong>CRITICAL NOTICE:</strong> AI outputs are probabilistic simulations based on historical data and Large Language Models. They do not constitute financial, agricultural, or legal advice.</p>
                    <p>AgrowCart shall NOT be liable for any financial losses, crop failure, or missed market opportunities resulting from reliance on AI-generated insights. Users are encouraged to cross-verify data with government portals (e.g., Agmarknet).</p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs">03</span>
                    Marketplace & Transactions
                </h2>
                <p className="text-zinc-600 leading-relaxed text-sm">
                    AgrowCart is a neutral marketplace. We facilitate connectivity but are not a party to the contract of sale unless specifically identified as a fulfillment partner.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-zinc-600 text-sm italic">
                    <li>Farmers are solely responsible for the accuracy of produce quality and FSSAI compliance where applicable.</li>
                    <li>Buyers acknowledge that produce is "as is" unless a specific quality audit is requested and paid for.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs">04</span>
                    Binding Arbitration & Jurisdictions
                </h2>
                <p className="text-zinc-600 leading-relaxed text-sm mb-4">
                    In the event of a dispute regarding platform services or transactions, AgrowCart reserves the right to attempt an internal mediation.
                </p>
                <div className="p-6 bg-zinc-900 text-white rounded-3xl text-[11px] leading-relaxed uppercase tracking-wider font-bold">
                    ANY DISPUTE THAT CANNOT BE RESOLVED INTERNALLY SHALL BE SUBJECT TO FINAL AND BINDING ARBITRATION IN KURUKSHETRA, HARYANA, INDIA. THE ARBITRATOR'S DECISION SHALL BE BINDING ON ALL PARTIES.
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs">05</span>
                    Beta Development Phase
                </h2>
                <p className="text-zinc-600 leading-relaxed text-sm">
                    The Platform is in a Beta phase. Services may be modified or terminated at any time. AgrowCart provides NO WARRANTY regarding uptime, data persistence, or the absence of software bugs. Use of the Platform during this phase is at the User's sole risk.
                </p>
            </section>

            <div className="mt-12 pt-10 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Legal Representative</p>
                        <p className="font-bold text-zinc-900">AgrowCart Legal & Compliance</p>
                        <p className="text-sm text-zinc-500">Corporate Cell, Haryana Hub</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Support Contact</p>
                        <a href="mailto:vibhusun01@gmail.com" className="text-green-600 font-bold hover:underline">legal@agrowcart.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;


import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 prose prose-green bg-white rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700">
                    We collect information you provide directly to us, such as when you create an account, list products, or contact customer support. This may include:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-700">
                    <li>Personal details (Name, Email, Phone Number, Address)</li>
                    <li>Farm details (Location, Land size, Crop types)</li>
                    <li>Transaction history and Payment information (stored securely by payment processors)</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-700">
                    <li>To facilitate marketplace transactions and delivery.</li>
                    <li>To provide AI-driven crop insights and price predictions.</li>
                    <li>To communicate with you regarding your account or orders.</li>
                    <li>To comply with legal obligations (e.g., FSSAI, GST).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data Sharing</h2>
                <p className="text-gray-700">
                    We do not sell your personal data. We may share data with:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-700">
                    <li>Logistics partners to fulfill deliveries.</li>
                    <li>Payment gateways to process transactions.</li>
                    <li>Legal authorities if required by law.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700">
                    We implement appropriate technical and organizational measures to protect your data. However, no internet transmission is 100% secure.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <p className="text-gray-700">
                    You have the right to access, correct, or delete your personal data. You can manage your preferences in your account settings.
                </p>
            </section>

            <section className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-100">
                <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                    Our Security Promise
                </h2>
                <p className="text-green-800 text-sm mb-4 font-medium">
                    At AgrowCart, we believe security is a fundamental part of agriculture. We use industry-leading tools to keep your data safe:
                </p>
                <ul className="space-y-3 text-green-800 text-sm">
                    <li className="flex gap-2">
                        <span className="font-bold">🔒 Secure Authentication:</span> We use encrypted JWT tokens and Google Auth to ensure only you can access your profile.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">🛡️ Verified Sources:</span> Our AI analysis and Webhooks are protected by cryptographic signatures to prevent hackers from spoofing messages.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">🧪 Transparent AI:</span> All AI-driven crop insights and price predictions are processed securely with no data being sold to third parties.
                    </li>
                </ul>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-600">
                    Privacy Officer:<br />
                    <span className="font-semibold text-gray-900">Data Protection Officer</span><br />
                    Email: privacy@agrowcart.com
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

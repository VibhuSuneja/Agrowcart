import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 prose prose-green bg-white rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
            <p className="text-sm text-gray-500 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                    Welcome to AgrowCart. By accessing or using our platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our services.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Marketplace Service</h2>
                <p className="text-gray-700">
                    AgrowCart acts as an intermediary platform connecting farmers, buyers, processors, and other stakeholders. We are not a seller of the produce unless explicitly stated.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-700">
                    <li>We facilitate transactions but do not guarantee the quality, safety, or legality of items advertised.</li>
                    <li>Users must provide accurate information regarding their produce, including true images and harvest dates.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Obligations</h2>
                <p className="text-gray-700">You agree to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-700">
                    <li>Provide accurate registration information.</li>
                    <li>Not use the platform for any illegal purpose, including selling prohibited items.</li>
                    <li>Respect the intellectual property rights of others.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Payment & Refunds</h2>
                <p className="text-gray-700">
                    Payments are processed through secure third-party gateways. Refunds are subject to our Return Policy. In case of disputes, AgrowCart's decision after investigation will be final.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
                <p className="text-gray-700">
                    AgrowCart shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service or any products purchased through it.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Governing Law</h2>
                <p className="text-gray-700">
                    These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Kurukshetra, Haryana, India.
                </p>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-600">
                    For any legal queries, please contact: <br />
                    <span className="font-semibold text-gray-900">AgrowCart Legal Team</span><br />
                    Email: legal@agrowcart.com
                </p>
            </div>
        </div>
    );
};

export default TermsAndConditions;

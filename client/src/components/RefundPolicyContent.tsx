import React from 'react';

export const RefundPolicyContent = () => (
    <div className="space-y-6">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Refund & Cancellation Policy</h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6 border-b pb-4">Effective Date: February 3, 2026</p>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">01</span>
                Order Cancellation
            </h2>
            <div className="space-y-3 text-zinc-600 text-xs leading-relaxed">
                <p><strong>Before Dispatch:</strong> Orders can be cancelled free of charge within <strong>24 hours</strong> of placement, provided the order has not been dispatched.</p>
                <p><strong>After Dispatch:</strong> Once an order is marked &quot;Out for Delivery&quot;, cancellation is not possible. You may refuse delivery and request a refund (subject to deductions).</p>
            </div>
        </section>

        <section className="mb-8 bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">02</span>
                Perishable Goods Policy
            </h2>
            <div className="bg-white p-4 rounded-xl border-l-4 border-amber-500 text-[10px] font-medium text-zinc-700 space-y-2 shadow-sm">
                <p><strong>⚠️ IMPORTANT:</strong> Millets and agricultural products are perishable goods.</p>
                <p>Returns are <strong>NOT accepted</strong> once delivery is completed and the delivery OTP is verified.</p>
                <p>Exceptions apply only if the product is damaged, contaminated, or significantly different from the listing.</p>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">03</span>
                Refund Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">Online Payments</p>
                    <p className="text-sm font-bold text-zinc-900">7-10 Business Days</p>
                    <p className="text-[10px] text-zinc-500">Refunded to original payment method via Stripe</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">Cash on Delivery</p>
                    <p className="text-sm font-bold text-zinc-900">10-14 Business Days</p>
                    <p className="text-[10px] text-zinc-500">Via bank transfer (NEFT/IMPS)</p>
                </div>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px]">04</span>
                How to Request a Refund
            </h2>
            <ol className="list-decimal list-inside text-zinc-600 text-xs leading-relaxed space-y-2">
                <li>Email us at <strong>vibhusun01@gmail.com</strong> with your Order ID</li>
                <li>Attach photos of the product (if damaged/defective)</li>
                <li>Our team will respond within <strong>48 hours</strong></li>
                <li>Approved refunds will be processed as per the timeline above</li>
            </ol>
        </section>

        <section className="mb-8 p-6 bg-red-50 rounded-3xl border border-red-100">
            <h2 className="text-lg font-bold text-red-900 mb-3">🚫 Non-Refundable Scenarios</h2>
            <ul className="text-zinc-700 text-[10px] leading-relaxed space-y-1">
                <li>• Orders cancelled after dispatch (delivery charges may apply)</li>
                <li>• Products consumed or opened after delivery</li>
                <li>• Incorrect address provided by customer leading to delivery failure</li>
                <li>• Delay due to natural disasters, strikes, or force majeure</li>
            </ul>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4">
            <div>
                <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Dispute Resolution</p>
                <p className="text-xs text-zinc-600">All disputes shall be subject to binding arbitration in Kurukshetra, Haryana, India as per our Terms of Service.</p>
            </div>
            <div>
                <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Contact</p>
                <p className="text-xs text-green-600 font-bold">vibhusun01@gmail.com</p>
                <p className="text-xs text-zinc-500 font-bold">+91 9468150076</p>
            </div>
        </div>
    </div>
);

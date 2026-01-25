'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
    User,
    ChevronRight,
    Sprout,
    Factory,
    Users,
    Rocket,
    ShoppingBag,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    Info
} from 'lucide-react'
import Link from 'next/link'

const USER_ROLES = [
    {
        id: 'farmer',
        name: 'Farmer',
        icon: <Sprout size={20} />,
        color: 'bg-green-600',
        steps: [
            "Create account as 'Farmer' to access the harvest log.",
            "Click 'Start Harvest Log' to list your raw millets (Bajra, Ragi, etc.).",
            "Use the 'Agri-Forecast' card to get AI advice based on your local weather.",
            "Check 'Market Prices' to decide the best time to sell your produce."
        ]
    },
    {
        id: 'processor',
        name: 'Processor',
        icon: <Factory size={20} />,
        color: 'bg-blue-600',
        steps: [
            "Register your unit to access the Market Intelligence dashboard.",
            "List value-added products (like Flour or Snacks).",
            "MANDATORY: Provide your 14-digit FSSAI license for product verification.",
            "Analyze margin trends to optimize your packaging and distribution."
        ]
    },
    {
        id: 'shg',
        name: 'SHG Group',
        icon: <Users size={20} />,
        color: 'bg-emerald-600',
        steps: [
            "Onboard your group to list collective produce.",
            "Access specialized support for community-driven millet value addition.",
            "Track collective sales and manage individual farmer contributions."
        ]
    },
    {
        id: 'buyer',
        name: 'Buyer',
        icon: <ShoppingBag size={20} />,
        color: 'bg-zinc-900',
        steps: [
            "Search for premium Haryana millets on the marketplace.",
            "Look for the 'Verified' shield to ensure FSSAI and Origin compliance.",
            "Understand health benefits via the 'Expert Opinions' section.",
            "Directly support local farmers by buying un-processed grains."
        ]
    }
]

export default function UserGuidePage() {
    const [activeRole, setActiveRole] = useState(USER_ROLES[0])

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-green-100">
            {/* Header */}
            <header className="bg-zinc-50 border-b border-zinc-200 py-6">
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-900 font-black uppercase tracking-tighter hover:opacity-70 transition-opacity">
                        <ArrowLeft size={18} /> AgrowCart Guide
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/docs" className="text-xs font-bold text-zinc-500 hover:text-green-600 transition-colors">Platform Docs</Link>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-black uppercase tracking-widest">Help Center</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

                    {/* Left: Role Selector */}
                    <div>
                        <h2 className="text-3xl font-black text-zinc-900 tracking-tighter mb-4">How it works</h2>
                        <p className="text-zinc-500 font-medium mb-10 leading-relaxed">
                            AgrowCart is designed to be intuitive for everyone. Select your role to see your personalized path.
                        </p>

                        <div className="space-y-3">
                            {USER_ROLES.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setActiveRole(role)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${activeRole.id === role.id
                                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20'
                                            : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeRole.id === role.id ? 'bg-white/10' : 'bg-zinc-100'}`}>
                                            {role.icon}
                                        </div>
                                        <span className="font-bold text-sm tracking-tight">{role.name}</span>
                                    </div>
                                    <ChevronRight size={16} className={activeRole.id === role.id ? 'opacity-100' : 'opacity-30'} />
                                </button>
                            ))}
                        </div>

                        {/* Mobile Warning Card */}
                        <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                            <div className="flex items-center gap-3 mb-3 text-blue-600">
                                <Info size={18} />
                                <h4 className="font-black text-xs uppercase">Device Optimization</h4>
                            </div>
                            <p className="text-sm text-blue-700/80 font-medium leading-relaxed">
                                Our dashboard is currently <strong className="text-blue-900">optimized for Desktop & Laptops</strong>. Mobile optimization is in active development.
                            </p>
                        </div>
                    </div>

                    {/* Right: Steps Display */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeRole.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-6 mb-12">
                                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl ${activeRole.color}`}>
                                        {activeRole.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">I am a {activeRole.name}</h3>
                                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Step-by-step Onboarding</p>
                                    </div>
                                </div>

                                <div className="space-y-6 relative">
                                    {/* Connection Line */}
                                    <div className="absolute left-6 top-6 bottom-6 w-px bg-zinc-100" />

                                    {activeRole.steps.map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-6 items-start relative z-10"
                                        >
                                            <div className="w-12 h-12 bg-white border-2 border-zinc-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                                <span className="font-black text-zinc-900">{idx + 1}</span>
                                            </div>
                                            <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex-1 hover:bg-zinc-100/50 transition-colors">
                                                <p className="text-zinc-700 font-medium leading-relaxed">{step}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-12 p-8 bg-green-50 rounded-[2.5rem] border border-green-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-zinc-900">Ready to start?</h4>
                                            <p className="text-xs text-zinc-600 font-medium">Your marketplace is just a few clicks away.</p>
                                        </div>
                                    </div>
                                    <Link href="/register" className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-900/10 hover:scale-105 active:scale-95">
                                        Register Now
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Verification Footer */}
            <footer className="border-t border-zinc-200 py-12 bg-zinc-50">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-full mb-6">
                        <ShieldCheck className="text-green-600" size={16} />
                        <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Verified Multi-Role Ecosystem</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium">© 2026 AgrowCart • Empowering Haryana's Millet Revolution • Phase 2 Beta</p>
                </div>
            </footer>
        </div>
    )
}

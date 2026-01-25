'use client'
import React from 'react'
import { motion } from 'motion/react'
import {
    BookOpen,
    User,
    Zap,
    Monitor,
    Smartphone,
    Terminal,
    ShieldCheck,
    Workflow,
    ChevronRight,
    Search,
    Code,
    Cpu,
    Database,
    Globe
} from 'lucide-react'
import Link from 'next/link'

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-green-100 selection:text-green-900">
            {/* Project Header */}
            <div className="bg-white border-b border-zinc-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-zinc-900 uppercase tracking-tighter">AgrowCart</h1>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Platform Documentation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-xs font-bold text-zinc-500 hover:text-green-600 transition-colors">Home</Link>
                        <Link href="/guide" className="text-xs font-bold text-zinc-500 hover:text-green-600 transition-colors">User Guide</Link>
                        <div className="h-4 w-px bg-zinc-200" />
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">v1.2 Beta</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Sidebar Nav */}
                    <div className="hidden lg:block space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Introduction</h3>
                            <ul className="space-y-3">
                                <li className="text-sm font-bold text-green-600 flex items-center gap-2 cursor-pointer">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                    Phase 1: Foundation
                                </li>
                                <li className="text-sm font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-2 cursor-pointer transition-colors">
                                    Vision & Strategy
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Features</h3>
                            <ul className="space-y-3">
                                <li className="text-sm font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-2 cursor-pointer transition-colors">AI Price Engine</li>
                                <li className="text-sm font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-2 cursor-pointer transition-colors">Traceability v2</li>
                                <li className="text-sm font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-2 cursor-pointer transition-colors">B2B Marketplace</li>
                            </ul>
                        </div>

                        <div className="bg-zinc-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                            <h4 className="text-xs font-black uppercase mb-2 opacity-60">Status</h4>
                            <p className="text-sm font-bold leading-relaxed mb-4">Actively refining the core millet ecosystem logic.</p>
                            <div className="flex items-center gap-2 text-[10px] font-black text-green-400">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                IN DEVELOPMENT
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-16">

                        {/* Hero Section */}
                        <section>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-6"
                            >
                                Building the Future of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-black">Sustainable Agriculture</span>
                            </motion.h2>
                            <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl font-medium">
                                AgrowCart is a next-generation marketplace platform designed to bridge the gap between Haryana's millet farmers and the global consumer base using AI and Blockchain-standard traceability.
                            </p>
                        </section>

                        {/* Development Phase Info */}
                        <section className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-zinc-900">Current Phase: Beta Build</h3>
                                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">January 2026 Release</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <ShieldCheck className="text-green-500 shrink-0" size={20} />
                                            <div>
                                                <p className="font-bold text-zinc-900">FSSAI Integrated Verification</p>
                                                <p className="text-zinc-500">All value-added products now undergo mandatory admin review of license digits before marketplace listing.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Workflow className="text-blue-500 shrink-0" size={20} />
                                            <div>
                                                <p className="font-bold text-zinc-900">AI-Powered Forecasting</p>
                                                <p className="text-zinc-500">Real-time market insights for farmers using Gemini 1.5 Pro to predict harvest demand trends.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <Monitor className="text-zinc-900 shrink-0" size={20} />
                                            <div>
                                                <p className="font-bold text-zinc-900 text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500">Desktop Optimized UI</p>
                                                <p className="text-zinc-600">Our current dashboard is precision-engineered for **Laptops and Desktops** to handle complex agricultural data and market analysis. </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Smartphone className="text-zinc-400 shrink-0" size={20} />
                                            <div>
                                                <p className="font-bold text-zinc-900 italic">Mobile Optimization (WIP)</p>
                                                <p className="text-zinc-500">We are currently optimising the mobile versions to ensure a seamless experience on smartphones. Coming Soon.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-50 border-t border-zinc-200 px-8 py-6 flex flex-wrap gap-8 items-center justify-center">
                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400">
                                    <Globe size={14} /> CLOUD DEPLOYED
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400">
                                    <Database size={14} /> MONGODB ATLAS
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400">
                                    <Terminal size={14} /> NEXT.JS 15+
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400">
                                    <Code size={14} /> TYPESCRIPT SECURED
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                                    <Search className="text-white" size={20} />
                                </div>
                                <h4 className="text-lg font-black mb-3">SEO Protocol</h4>
                                <p className="text-zinc-400 text-sm leading-relaxed">Systematic indexing of crop market prices to capture high-intent agricultural search traffic from North India.</p>
                            </div>
                            <div className="p-8 bg-green-600 rounded-[2.5rem] text-white">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                                    <Cpu className="text-white" size={20} />
                                </div>
                                <h4 className="text-lg font-black mb-3">Token Economics</h4>
                                <p className="text-white/80 text-sm leading-relaxed">Aggressive AI caching layer implemented to minimize API cost while maintaining instant response times for farmers.</p>
                            </div>
                            <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="text-white" size={20} />
                                </div>
                                <h4 className="text-lg font-black mb-3">Transparency</h4>
                                <p className="text-white/80 text-sm leading-relaxed">Legal Metrology compliance ensured with City-of-Origin tracking on every millet batch listed on the platform.</p>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    )
}

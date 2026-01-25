'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Book, ChevronRight, FileText, Layout, Users, Zap } from 'lucide-react'
import Nav from '@/components/Nav' // Assuming Nav is available
import Footer from '@/components/Footer' // Reuse existing Footer

const CONTENT = [
    {
        title: "Getting Started",
        icon: Zap,
        content: `Welcome to the Millet Value Chain Platform. This guide helps you navigate the features available for different roles.
        
        To begin, you must log in or register. During registration or profile editing, you can select your verification role:
        - Consumer: Default role for buying products.
        - Farmer: Sell produce, access AI predictions.
        - Processor/Startup: B2B procurement and selling value-added goods.
        - Delivery Partner: Manage logistics.
        - SHG: Self Help Groups active in the ecosystem.`
    },
    {
        title: "Farmer Dashboard",
        icon: Layout,
        content: `The hub for farmers to manage their operations.
        
        Key Features:
        - Add Harvest: List new crops with photos, quantity, and expected price.
        - Market Insights: View AI-predicted price trends and demand heatmaps.
        - Negotiation: Chat directly with buyers to settle prices.
        - Weather: Real-time agricultural weather forecasts.`
    },
    {
        title: "Buyer Marketplace",
        icon: Users,
        content: `Designed for Corporate Buyers, Processors, and Startups.
        
        Key Features:
        - Live Feed:Browse real-time listings from Farmers and SHGs.
        - Quality AI: Analyze crop quality using image recognition before buying.
        - Bulk Negotiation: Initiate bulk orders and negotiate terms via chat.
        - Procurement: Track active orders and logistics.`
    },
    {
        title: "Platform Features",
        icon: FileText,
        content: `
        - Multi-Language: Support for English and Hindi (locale switching).
        - AI Chatbot: 24/7 assistance for platform navigation and farming queries.
        - Traceability: Track the journey of every grain from farm to fork via QR/ID.`
    }
]

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
            {/* Minimal Header for Doc Page if Nav is too complex, but using Nav for consistency */}
            {/* Ideally we use the Main Layout Nav, but here we can just create a simple header or reuse Nav if user is logged in. 
                For a public doc page, let's keep it simple. */}

            <div className="relative pt-32 pb-20 px-6 md:px-20 mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 mb-20"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-2xl text-green-700 mb-4">
                        <Book size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
                        Platform <span className="text-green-600">Documentation</span>
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
                        Complete guide to navigating the AgrowCart ecosystem, from farm registration to B2B procurement.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-4 space-y-4 sticky top-32 h-fit">
                        <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest px-4">Table of Contents</h3>
                        <div className="space-y-1">
                            {CONTENT.map((section, idx) => (
                                <a
                                    key={idx}
                                    href={`#section-${idx}`}
                                    className="block p-4 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-200 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                            <section.icon size={18} />
                                        </div>
                                        <span className="font-bold text-zinc-600 group-hover:text-zinc-900">{section.title}</span>
                                        <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 text-zinc-300 transition-opacity" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-8 space-y-12">
                        {CONTENT.map((section, idx) => (
                            <motion.div
                                id={`section-${idx}`}
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-900/5"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                                        <section.icon size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-zinc-900">{section.title}</h2>
                                </div>
                                <div className="prose prose-zinc prose-lg max-w-none">
                                    <p className="whitespace-pre-line text-zinc-600 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
    Users,
    Search,
    Filter,
    TrendingUp,
    Globe,
    ShieldCheck,
    Zap,
    Mail,
    ArrowRight,
    Sparkles,
    Briefcase,
    Target,
    BarChart3,
    Handshake,
    MessageCircle,
    ChevronRight,
    CheckCircle2
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const INVESTORS = [
    {
        id: 1,
        name: 'Haryana Angel Network',
        logo: 'HAN',
        focus: ['Agri-Tech', 'Organic Supply', 'Rural Fintech'],
        stage: 'Seed to Bridge',
        ticketSize: '₹50L - ₹2Cr',
        portfolio: 24,
        description: 'Primary focus on Northern India agricultural disruption and millet value chains.',
        color: 'from-purple-500 to-indigo-600',
        match: 98
    },
    {
        id: 2,
        name: 'Green Harvest Ventures',
        logo: 'GHV',
        focus: ['Sustainability', 'Bio-Packaging', 'Smart Irrigation'],
        stage: 'Series A',
        ticketSize: '₹2Cr - ₹10Cr',
        portfolio: 15,
        description: 'Backing founders who are prioritizing climate-resilient agriculture.',
        color: 'from-emerald-500 to-teal-600',
        match: 85
    },
    {
        id: 3,
        name: 'Bharat Agritech Fund',
        logo: 'BAF',
        focus: ['SaaS', 'IoT Nodes', 'Predictive AI'],
        stage: 'Seed to Series B',
        ticketSize: '₹1Cr - ₹15Cr',
        portfolio: 42,
        description: 'Largest deep-tech fund specifically for rural transformation in South Asia.',
        color: 'from-blue-500 to-cyan-600',
        match: 72
    },
    {
        id: 4,
        name: 'Millet Capital',
        logo: 'MC',
        focus: ['Innovative Food', 'FMCG', 'Direct-to-Consumer'],
        stage: 'Angel to Seed',
        ticketSize: '₹10L - ₹50L',
        portfolio: 8,
        description: 'Niche fund dedicated exclusively to Millet-based startups and Shree Anna innovations.',
        color: 'from-amber-500 to-orange-600',
        match: 94
    }
]

export default function InvestorsPage() {
    const router = useRouter()
    const { userData } = useSelector((state: RootState) => state.user)
    const [search, setSearch] = useState('')
    const [filterFocus, setFilterFocus] = useState('All')
    const [selectedInvestor, setSelectedInvestor] = useState<any>(null)

    const filteredInvestors = INVESTORS.filter(inv => {
        const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
            inv.focus.some(f => f.toLowerCase().includes(search.toLowerCase()))
        const matchesFilter = filterFocus === 'All' || inv.focus.includes(filterFocus)
        return matchesSearch && matchesFilter
    })

    const allFocusAreas = ['All', ...Array.from(new Set(INVESTORS.flatMap(inv => inv.focus)))]

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-background-dark selection:bg-purple-100 selection:text-purple-900">
            <Nav user={userData as any} />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-black uppercase tracking-[0.3em] text-[10px] bg-purple-50 dark:bg-purple-900/20 w-fit px-3 py-1 rounded-lg border border-purple-100 dark:border-purple-900/40"
                        >
                            <Target size={14} className="animate-pulse" />
                            <span>Capital Network</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none'
                        >
                            Investor <span className="text-zinc-400 dark:text-zinc-500">Gateway.</span>
                        </motion.h1>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg font-medium text-lg italic">
                            Connect with verified capital partners who share your vision for the future of agriculture.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-xl shadow-purple-900/5 border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Handshake size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500">Network Reach</div>
                                <div className="text-xl font-black text-zinc-900 dark:text-white">₹250Cr+ LP Pool</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by investor name or focus area..."
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] py-5 pl-16 pr-8 text-zinc-800 dark:text-white font-bold text-sm outline-none focus:ring-4 focus:ring-purple-500/10 transition-all shadow-xl shadow-zinc-900/5"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                        {allFocusAreas.map(area => (
                            <button
                                key={area}
                                onClick={() => setFilterFocus(area)}
                                className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${filterFocus === area
                                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl'
                                    : 'bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50'
                                    }`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Match Recommendation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden group border border-white/5 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -mr-48 -mt-48 transition-transform group-hover:scale-125" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] w-fit border border-purple-500/20">
                                <Sparkles size={14} className="animate-spin-slow" />
                                <span>AI Matchmaking Engine</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight leading-[0.9]">
                                High Probability <br /><span className="text-purple-400 underline decoration-purple-500/30 underline-offset-8 italic">Investor Identified.</span>
                            </h2>
                            <p className="text-zinc-400 max-w-lg font-medium text-lg leading-relaxed">
                                Our neural engine analyzed your Startup profile and identified <span className="text-white font-black underline decoration-purple-500/50">Millet Capital</span> as your strongest match for a Seed funding round.
                            </p>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <div className="text-6xl font-black text-purple-400 tracking-tighter">94%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">Match Score</div>
                            </div>
                            <button
                                onClick={() => setSelectedInvestor(INVESTORS.find(i => i.logo === 'MC'))}
                                className="bg-white text-zinc-900 px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-purple-400 hover:text-white transition-all shadow-2xl flex items-center gap-3"
                            >
                                View Pitch Details
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Investor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredInvestors.map((investor, index) => (
                        <motion.div
                            key={investor.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-zinc-900/5 group flex flex-col justify-between"
                        >
                            <div className="space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${investor.color} rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl ring-8 ring-zinc-50 dark:ring-zinc-800 transition-transform group-hover:scale-110`}>
                                        {investor.logo}
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border border-purple-100 dark:border-purple-900/40">
                                            <Zap size={10} className="fill-current" />
                                            {investor.match}% Match
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-none group-hover:text-purple-600 transition-colors">
                                        {investor.name}
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                                        {investor.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {investor.focus.map(f => (
                                        <span key={f} className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-700">
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-8 border-y border-zinc-50 dark:border-zinc-800">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Typical Check</div>
                                        <div className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">{investor.ticketSize}</div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Stage focus</div>
                                        <div className="text-lg font-black text-purple-600 tracking-tight">{investor.stage}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-black text-[10px]">
                                        {investor.portfolio}
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Active Portfolio</span>
                                </div>
                                <button
                                    onClick={() => setSelectedInvestor(investor)}
                                    className="p-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-110 active:scale-95 transition-all shadow-xl"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer section inside the page */}
                <div className="bg-purple-600 rounded-[3.5rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:scale-125 transition-transform duration-1000" />

                    <div className="relative z-10 space-y-4 text-center md:text-left">
                        <h2 className="text-4xl font-black tracking-tighter">Ready to showcase your MVP?</h2>
                        <p className="text-purple-100 font-medium text-lg max-w-md opacity-80">
                            Our compliance bot will audit your pitch deck before it reaches the capital network.
                        </p>
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <button
                            onClick={() => toast.success("Opening Portfolio Manager...")}
                            className="bg-zinc-900 text-white px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-zinc-900 transition-all shadow-2xl"
                        >
                            Manage Portfolio
                        </button>
                    </div>
                </div>
            </div>

            {/* Investor Details Modal */}
            <AnimatePresence>
                {selectedInvestor && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            onClick={() => setSelectedInvestor(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-[4rem] shadow-3xl overflow-hidden relative flex flex-col lg:flex-row z-[1010]"
                        >
                            <div className={`lg:w-1/3 bg-gradient-to-br ${selectedInvestor.color} p-12 text-white flex flex-col justify-between`}>
                                <div className="space-y-8">
                                    <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center text-4xl font-black backdrop-blur-xl border border-white/20">
                                        {selectedInvestor.logo}
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black leading-[0.9] tracking-tighter">
                                            {selectedInvestor.name}
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedInvestor.focus.map((f: string) => (
                                                <span key={f} className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg border border-white/10">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-xl">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Match Insights</div>
                                        <p className="text-sm font-medium leading-relaxed italic">"Highly aligned with your current traction in Northern India."</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Investment Thesis</div>
                                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{selectedInvestor.description}</h3>
                                    </div>
                                    <button
                                        onClick={() => setSelectedInvestor(null)}
                                        className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-900 transition-all rounded-2xl"
                                    >
                                        <CheckCircle2 size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-12">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Growth Phase</div>
                                                <div className="text-sm font-black text-zinc-800 dark:text-white">{selectedInvestor.stage}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                <Globe size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Geography</div>
                                                <div className="text-sm font-black text-zinc-800 dark:text-white">Pan-India / MENA</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <Target size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Avg. Ticket Size</div>
                                                <div className="text-sm font-black text-zinc-800 dark:text-white">{selectedInvestor.ticketSize}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                                                <BarChart3 size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Board Reqs</div>
                                                <div className="text-sm font-black text-zinc-800 dark:text-white">Observation Seat</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="text-center p-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                                        <h4 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Initiate Secure Pitch?</h4>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-8">This will share your Innovation Portfolio and Growth Analytics with the investor.</p>
                                        <div className="flex gap-4 justify-center">
                                            <button
                                                onClick={() => {
                                                    toast.success("Pitch transmitted successfully!");
                                                    setSelectedInvestor(null);
                                                }}
                                                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-600 transition-all flex items-center gap-2"
                                            >
                                                <Zap size={14} className="fill-current text-purple-400" />
                                                Send MVP Deck
                                            </button>
                                            <button className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-50 transition-all flex items-center gap-2">
                                                <MessageCircle size={14} />
                                                In-App Chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    )
}

'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
    Zap, Sparkles, TrendingUp, MapPin, Search,
    Brain, BarChart3, Globe, ShieldCheck, ArrowRight,
    Loader, Sprout, Info, DollarSign, Package, ArrowLeft
} from 'lucide-react'
import axios from 'axios'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DemandHeatmap from '@/components/DemandHeatmap'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Prediction {
    estimatedPrice: number
    priceTrend: "up" | "down" | "stable"
    factors: string[]
    advice: string
}

interface MarketInsight {
    demandTrend: string
    forecast: string
    highDemandRegions: string[]
}

export default function AIInsightsPage() {
    const { userData } = useSelector((state: RootState) => state.user)
    const router = useRouter()

    useEffect(() => {
        if (!userData) {
            router.push('/login')
        }
    }, [userData, router])

    // Price Simulation State
    const [simRegion, setSimRegion] = useState('')
    const [simCrop, setSimCrop] = useState('')
    const [simQty, setSimQty] = useState('')
    const [prediction, setPrediction] = useState<Prediction | null>(null)
    const [simLoading, setSimLoading] = useState(false)

    // Market Insight State
    const [insightCrop, setInsightCrop] = useState('Ragi')
    const [insight, setInsight] = useState<MarketInsight | null>(null)
    const [insightLoading, setInsightLoading] = useState(false)

    const handleSimulation = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!simRegion || !simCrop || !simQty) return toast.error("Fill simulation parameters")
        setSimLoading(true)
        try {
            const res = await axios.post('/api/ai/millet-price', { region: simRegion, quantity: simQty, crop: simCrop })
            setPrediction(res.data)
            toast.success("Simulation Complete")
        } catch (error) {
            toast.error("Simulation failed")
        } finally {
            setSimLoading(false)
        }
    }

    const fetchInsight = async (cropName: string) => {
        setInsightLoading(true)
        try {
            const res = await axios.post('/api/ai/market-insight', { crop: cropName })
            setInsight(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setInsightLoading(false)
        }
    }

    useEffect(() => {
        fetchInsight('Ragi')
    }, [])

    return (
        <main className="min-h-screen bg-zinc-50 pt-[100px]">
            <Nav user={userData} />

            <div className="w-[95%] md:w-[90%] xl:w-[85%] mx-auto py-12 space-y-16">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-600 font-bold mb-8 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-green-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Home</span>
                </Link>

                {/* Hero / Header */}
                <header className="max-w-4xl space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg border border-green-100 font-black text-[10px] uppercase tracking-widest"
                    >
                        <Brain size={14} className="animate-pulse" />
                        <span>Intelligence Division</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter leading-[0.9]"
                    >
                        AI <span className="text-zinc-400">Market</span> <br />Insights.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-zinc-500 font-medium max-w-2xl"
                    >
                        Leverage neural-network predictions and real-time market data to make smarter agricultural business decisions.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Market Price Simulator */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3.5rem] border border-zinc-100 shadow-2xl shadow-green-900/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30" />

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-green-400 shadow-xl">
                                <Zap fill="currentColor" size={24} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Price Predictor</h2>
                                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest opacity-60">Revenue Simulation</p>
                            </div>
                        </div>

                        <form onSubmit={handleSimulation} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <input
                                placeholder="Region (Ex: Mandya)"
                                className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                                value={simRegion} onChange={e => setSimRegion(e.target.value)}
                            />
                            <input
                                placeholder="Crop (Ex: Ragi)"
                                className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                                value={simCrop} onChange={e => setSimCrop(e.target.value)}
                            />
                            <input
                                placeholder="Quantity (kg)"
                                type="number"
                                className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                                value={simQty} onChange={e => setSimQty(e.target.value)}
                            />
                            <button
                                className="col-span-full bg-zinc-900 text-white rounded-2xl p-4 font-black uppercase tracking-widest text-xs hover:bg-green-600 transition-all flex items-center justify-center gap-2 group shadow-xl"
                                disabled={simLoading}
                            >
                                {simLoading ? <Loader className="animate-spin" size={18} /> : (
                                    <>
                                        Run Simulation <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <AnimatePresence mode="wait">
                            {prediction ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 text-white border border-white/5"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Estimated Market Price</p>
                                                <div className="text-6xl font-black tracking-tighter">₹{prediction.estimatedPrice}<span className="text-lg text-green-400 ml-2">/kg</span></div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex-1">
                                                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Price Trend</p>
                                                    <p className={`text-sm font-black uppercase ${prediction.priceTrend === 'up' ? 'text-green-400' : prediction.priceTrend === 'down' ? 'text-red-400' : 'text-blue-400'}`}>
                                                        {prediction.priceTrend}
                                                    </p>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex-1">
                                                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">AI Confidence</p>
                                                    <p className="text-sm font-black uppercase text-white">94% Accurate</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Neural Advisory</p>
                                            <div className="p-6 bg-green-400/10 rounded-2xl border border-green-400/20">
                                                <p className="text-sm font-medium leading-relaxed italic text-zinc-300">
                                                    "{prediction.advice}"
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {prediction.factors.map((f, i) => (
                                                    <span key={i} className="text-[9px] font-bold bg-white/5 px-3 py-1 rounded-full text-zinc-400">#{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-48 border-2 border-dashed border-zinc-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 bg-zinc-50 transition-all hover:bg-zinc-100 group">
                                    <BarChart3 className="text-zinc-300 group-hover:text-green-600 transition-colors mb-2" size={32} />
                                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Awaiting Simulation Parameters</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.section>

                    {/* Market Intelligence & MSP Tracker */}
                    <aside className="space-y-8 h-full flex flex-col">
                        <div className="bg-zinc-900 rounded-[3.5rem] p-8 text-white shadow-2xl relative overflow-hidden group flex-1">
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-green-600 rounded-full blur-[80px] opacity-20" />

                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black flex items-center gap-3">
                                    <Globe className="text-green-400 animate-spin-slow" size={24} />
                                    Intel Hub
                                </h3>
                                <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border border-green-500/30">
                                    Live Updates
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {/* MSP Tracker Card */}
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group hover:scale-[1.02]">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-green-500/20 rounded-lg text-green-400">
                                                <DollarSign size={14} />
                                            </div>
                                            <h4 className="font-black text-sm tracking-tight text-zinc-100">MSP Tracker</h4>
                                        </div>
                                        <TrendingUp size={14} className="text-green-500" />
                                    </div>
                                    <p className="text-[11px] text-zinc-400 font-medium leading-tight">
                                        "Ragi pricing up <span className="text-green-400 font-bold">12% in Mandya</span> hub this week. Trending above MSP."
                                    </p>
                                </div>

                                {/* Demand Alert Card */}
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group hover:scale-[1.02]">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                                                <Package size={14} />
                                            </div>
                                            <h4 className="font-black text-sm tracking-tight text-zinc-100">Demand Heatmap</h4>
                                        </div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    </div>
                                    <p className="text-[11px] text-zinc-400 font-medium leading-tight">
                                        "High processing demand in <span className="text-blue-400 font-bold">Pune/Hyderabad</span> for Foxtail. Buyer volume +40%."
                                    </p>
                                </div>

                                {/* Smart Logistics Card */}
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group opacity-60">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-black text-xs tracking-tight text-zinc-400">Route Optimization</h4>
                                        <MapPin size={12} className="text-zinc-500" />
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-medium italic">
                                        Scan for 15% lower freight rates to major processing clusters.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-1 w-full bg-linear-to-br from-green-500 to-emerald-700 rounded-[2.5rem] shadow-xl">
                            <div className="bg-white p-8 rounded-[2.4rem] h-full space-y-5">
                                <ShieldCheck className="text-green-600" size={28} />
                                <h3 className="text-xl font-black text-zinc-900 leading-none">Verified Protocol</h3>
                                <p className="text-zinc-500 text-xs font-medium leading-relaxed">Cross-referenced with Agmarknet and SIH historical mandi price datasets.</p>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 group">
                                    View Data Sources <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Second Row: Market Forecasting & Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Market Intelligence Feed */}
                    <section className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-zinc-100 shadow-2xl shadow-green-900/5">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <BarChart3 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Market Intel</h3>
                                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Demand Forecasting</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {['Ragi', 'Bajra', 'Jowar'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => fetchInsight(c)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${insightCrop === c ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {insightLoading ? (
                            <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                <Loader className="animate-spin text-blue-600" size={32} />
                                <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">Scanning Mandi Trends...</p>
                            </div>
                        ) : insight ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <TrendingUp size={12} className="text-green-600" />
                                        Demand Trend
                                    </p>
                                    <p className="text-lg font-black text-zinc-800">{insight.demandTrend}</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">6-Month Forecast</p>
                                    <p className="text-sm font-medium leading-relaxed text-zinc-600 bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                                        {insight.forecast}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Strategic Markets</p>
                                    <div className="flex flex-wrap gap-2">
                                        {insight.highDemandRegions.map(r => (
                                            <span key={r} className="px-4 py-2 bg-green-50 text-green-700 rounded-2xl text-[10px] font-black border border-green-100">{r}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </section>

                    {/* Integrated Heatmap */}
                    <DemandHeatmap />

                </div>

                {/* Footer Disclaimer */}
                <div className="bg-zinc-100 p-8 rounded-[2.5rem] border border-zinc-200 flex items-start gap-4">
                    <Info className="text-zinc-400 shrink-0" size={20} />
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">
                        AgrowCart AI Insights are generated using Large Language Models and historical market data. While we strive for maximum accuracy, market conditions are subject to unforeseen shifts. Please use these simulations as a guide alongside traditional market analysis for high-value trades.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    )
}

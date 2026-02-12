'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { RootState } from '@/redux/store'
import {
    Loader, TrendingUp, DollarSign, Plus, Sparkles, Sprout, Briefcase,
    Zap, X, MapPin, ArrowRight, ShieldCheck, History, Info, Gavel,
    Calendar, Fingerprint, Activity, LineChart as ChartIcon, Package, Upload, Trash2, Send, Users
} from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts'
import VoiceAssistant from '@/components/VoiceAssistant'
import DemandHeatmap from '@/components/DemandHeatmap'
import FarmerNegotiations from '@/components/FarmerNegotiations'
import WeatherCard from '@/components/WeatherCard'
import EventCalendar from '@/components/EventCalendar'
import NewsCard from '@/components/NewsCard'
import SchemesCard from '@/components/SchemesCard'
import MarketPricesWidget from '@/components/MarketPricesWidget'
import Nav from '@/components/Nav'
import TutorialGuide from '@/components/TutorialGuide'
import { useTranslations } from '@/i18n/LanguageProvider'

import toast from 'react-hot-toast'
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

const MOCK_TRENDS = [
    { name: 'Week 1', price: 42 },
    { name: 'Week 2', price: 45 },
    { name: 'Week 3', price: 43 },
    { name: 'Week 4', price: 48 },
    { name: 'Week 5', price: 52 },
    { name: 'Week 6', price: 50 },
    { name: 'Week 7', price: 55 },
]

const SHG_TOUR_STEPS = [
    {
        targetId: 'shg-header',
        title: 'Community Command',
        content: 'Welcome to the SHG Aggregate Hub. Manage the collective produce of your local farmer group from this central dashboard.'
    },
    {
        targetId: 'shg-analytics',
        title: 'Collective Bargaining Power',
        content: 'Use our AI to simulate bulk rates. Aggregating smaller lots allows you to negotiate better prices with large buyers.'
    },
    {
        targetId: 'shg-add',
        title: 'Log Community Produce',
        content: 'Collect crops from individual members and log them here as a single bulk lot. This simplifies logistics and quality control.'
    },
    {
        targetId: 'shg-portfolio',
        title: 'Aggregate Inventory',
        content: 'Track all active community listings. Ensure your group\'s total output is visible to FPOs and corporate buyers.'
    },
    {
        targetId: 'tour-voice',
        title: 'Hands-Free Management',
        content: 'Busy at the collection center? Use voice commands to quickly log new arrivals without stopping your work.'
    }
]

const CATEGORIES = [
    "Raw Millets",
    "Millet Rice",
    "Millet Flour",
    "Millet Snacks",
    "Value-Added",
    "Seeds",
    "Organic Mix"
]

function SHGDashboard() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [region, setRegion] = useState('')
    const [quantity, setQuantity] = useState('')
    const [crop, setCrop] = useState('')
    const [prediction, setPrediction] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [showAddCrop, setShowAddCrop] = useState(false)
    const [newCrop, setNewCrop] = useState<{
        name: string, quantity: string, price: string, category: string, unit: string, farmId: string, harvestDate: string, image: File | null, imagePreview: string | null
    }>({
        name: '', quantity: '', price: '', category: 'Raw Millets', unit: 'kg', farmId: 'SHG-' + Math.floor(Math.random() * 9000 + 1000), harvestDate: new Date().toISOString().split('T')[0], image: null, imagePreview: null
    })
    const [crops, setCrops] = useState<Array<any>>([])
    const [cropImage, setCropImage] = useState<File | null>(null)
    const [cropPreview, setCropPreview] = useState<string | null>(null)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [isAuthentic, setIsAuthentic] = useState(false)
    const t = useTranslations('imageAuthenticity')

    const handleVoiceCommand = (command: string) => {
        const cmd = command.toLowerCase()
        if (cmd.includes('add') || cmd.includes('list') || cmd.includes('new') || cmd.includes('harvest')) {
            setShowAddCrop(true)
            toast.success("Voice Command: Opening Listing Form")
        } else if (cmd.includes('close') || cmd.includes('cancel')) {
            setShowAddCrop(false)
            toast.success("Voice Command: Closing Form")
        }
    }

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const res = await axios.get('/api/farmer/get-products')
                setCrops(res.data)
            } catch (error) {
                console.error("Failed to fetch products", error)
            }
        }
        fetchCrops()
    }, [])

    const deleteCrop = async (id: string) => {
        if (!confirm("Are you sure you want to remove this harvest listing?")) return
        try {
            await axios.post("/api/admin/delete-product", { productId: id })
            setCrops(crops.filter(c => c._id !== id))
            toast.success("Record removed from ledger")
        } catch (error) {
            toast.error("Failed to delete Listing")
        }
    }

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setPrediction(null)
        try {
            const res = await axios.post('/api/ai/millet-price', { region, quantity, crop })
            setPrediction(res.data)
            toast.success("Market Intelligence Sync Complete")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Market analysis offline")
        } finally {
            setLoading(false)
        }
    }

    const handleCropImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Technical Validation: Size check
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t('errorTooLarge'))
                return
            }

            const img = new Image()
            img.src = URL.createObjectURL(file)
            img.onload = () => {
                setCropImage(file)
                setCropPreview(URL.createObjectURL(file))
            }
        }
    }

    const analyzeCrop = async () => {
        if (!cropImage) return
        setAnalyzing(true)
        setAnalysisResult(null)
        try {
            const reader = new FileReader()
            reader.onloadend = async () => {
                const base64 = reader.result as string
                const res = await axios.post('/api/ai/crop-analysis', { image: base64 })
                setAnalysisResult(res.data)
                toast.success("Audit complete: Grade Assigned")
            }
            reader.readAsDataURL(cropImage)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Analysis failed")
        } finally {
            setAnalyzing(false)
        }
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <Loader className="animate-spin text-green-600" size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 pt-[110px] md:pt-[120px] selection:bg-green-100 selection:text-green-900">
            <Nav user={userData as any} />
            <VoiceAssistant onCommand={handleVoiceCommand} />
            <div className="w-[95%] md:w-[90%] xl:w-[85%] 2xl:max-w-[1400px] mx-auto space-y-8 md:space-y-12">

                {/* Header Section */}
                <div id="shg-header" className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
                    <div className="space-y-3 md:space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-green-600 font-black uppercase tracking-[0.3em] text-[10px] bg-green-50 w-fit px-3 py-1 rounded-lg border border-green-100"
                        >
                            <Users size={14} className="animate-pulse" />
                            <span>SHG Aggregate Hub</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-[0.9] sm:leading-none'
                        >
                            Collect. <span className="text-zinc-400">Manage.</span> <br />Empower.
                        </motion.h1>
                        <p className="text-zinc-500 max-w-lg font-medium text-base md:text-lg">Aggregate community produce and manage listings with AI-driven market intelligence.</p>
                    </div>

                    <div className="flex gap-4 items-end">
                        <div className="w-[300px] hidden lg:block">
                            <WeatherCard />
                        </div>
                        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-green-900/5 border border-zinc-100 flex items-center gap-4 h-fit">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <Activity size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase text-zinc-400">Success Rate</div>
                                <div className="text-xl font-black text-zinc-900">99.1%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="block lg:hidden mb-8">
                    <WeatherCard />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AI Price Predictor Card */}
                    <motion.div
                        id="shg-analytics"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-green-900/5 border border-zinc-100 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 transition-all group-hover:scale-110" />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-zinc-900/40">
                                        <Zap className="text-green-400 fill-green-400" size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Aggregation Analytics</h2>
                                        <p className="text-zinc-500 text-sm font-medium italic">Market sentiment analysis v2.1</p>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        Network Active
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                                <div className="relative group">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={20} />
                                    <input
                                        placeholder="Target Region"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold text-sm"
                                        value={region} onChange={e => setRegion(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <Sprout className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={20} />
                                    <input
                                        placeholder="Crop Variety"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold text-sm"
                                        value={crop} onChange={e => setCrop(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={20} />
                                    <input
                                        placeholder="Aggregate Volume"
                                        type="number"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold text-sm"
                                        value={quantity} onChange={e => setQuantity(e.target.value)}
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="bg-zinc-900 text-white py-5 rounded-[1.5rem] md:col-span-3 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-green-600 shadow-2xl shadow-zinc-900/20 transition-all"
                                >
                                    {loading ? <Loader className="animate-spin" /> : (
                                        <>
                                            <span>Run Collective Market Simulation</span>
                                            <Sparkles size={20} />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <AnimatePresence mode="wait">
                                {prediction ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 bg-zinc-900 rounded-[2.5rem] border border-white/5 shadow-2xl"
                                    >
                                        <div className="space-y-6">
                                            <div className="inline-flex items-center gap-3 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                                <ChartIcon size={12} />
                                                <span>Aggregate Prediction</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm text-zinc-400 font-bold uppercase tracking-widest">Estimated Bulk Rate</div>
                                                <div className="text-6xl font-black text-white tracking-tighter">₹{prediction.estimatedPrice}<span className="text-2xl text-green-400">/kg</span></div>
                                            </div>
                                            <p className="text-zinc-400 font-medium leading-relaxed italic border-l-2 border-green-500/50 pl-4">
                                                {prediction.advice}
                                            </p>
                                        </div>
                                        <div className="h-[250px] min-h-[250px] w-full relative">
                                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                                <AreaChart data={MOCK_TRENDS || []}>
                                                    <defs>
                                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '16px', color: '#fff' }}
                                                        itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                                                    />
                                                    <Area type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 text-zinc-300">
                                            <ChartIcon size={32} />
                                        </div>
                                        <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">Await Simulation</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Event Calendar */}
                    <div className="h-full">
                        <EventCalendar />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="md:col-span-1 lg:col-span-2">
                        <DemandHeatmap />
                    </div>
                    <div className="md:col-span-1 lg:col-span-2">
                        <MarketPricesWidget />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* News Feed (Resource Hub) */}
                    <div className="lg:col-span-1 h-[500px]">
                        <NewsCard />
                    </div>

                    {/* Member Management */}
                    <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-green-900/5 border border-zinc-100 flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                                    <Users size={14} />
                                    <span>Community Roster</span>
                                </div>
                                <h3 className="text-3xl font-black text-zinc-900 tracking-tight">SHG Members</h3>
                            </div>
                            <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                42 Active Members
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-4">
                            {[
                                { name: "Rajesh Kumar", role: "President", location: "Kolar", joined: "Oct 2023" },
                                { name: "Sunita Devi", role: "Secretary", location: "Malur", joined: "Nov 2023" },
                                { name: "Amit Singh", role: "Member", location: "Bangarpet", joined: "Jan 2024" },
                                { name: "Meena Rao", role: "Member", location: "Kolar", joined: "Feb 2024" },
                                { name: "Prakash J", role: "Member", location: "Malur", joined: "Mar 2024" }
                            ].map((m, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:bg-white hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-400 font-black text-xs border border-zinc-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            {m.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-black text-zinc-900">{m.name}</p>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{m.role} • {m.location}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Joined</p>
                                        <p className="text-xs font-bold text-zinc-600">{m.joined}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Support Programs Section */}
                <div className="bg-green-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-white/70 font-black uppercase tracking-[0.3em] text-[10px]">
                                <Briefcase size={14} />
                                <span>Community Mandates</span>
                            </div>
                            <h3 className="text-3xl font-black leading-tight tracking-tight">SHG Support <br />Programs</h3>
                        </div>
                        <Link href="/tools/contract-hub">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:shadow-2xl transition-all w-fit flex items-center gap-3 border border-white/20 whitespace-nowrap lg:mr-8"
                            >
                                <Gavel size={16} />
                                <span>Draft Agreements</span>
                            </motion.button>
                        </Link>
                    </div>

                    <div className="space-y-4 relative z-10 w-full mb-6">
                        {[
                            { title: 'Livelihood Mission', desc: 'Support for collective aggregation centers.', url: 'https://nrlm.gov.in/' },
                            { title: 'Mahila Kisan Mission', desc: 'Empowering women in the millet value chain.', url: 'https://mksp.nrlm.gov.in/' },
                            { title: 'Village Entrepreneurship', desc: 'Grants for local millet processing units.', url: 'https://svep.nrlm.gov.in/' }
                        ].map((scheme, i) => (
                            <div
                                key={i}
                                className="p-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-[2rem] cursor-pointer group backdrop-blur-md transition-all flex items-center justify-between"
                                onClick={() => {
                                    toast.success(`Opening ${scheme.title} Portal...`);
                                    window.open(scheme.url, '_blank');
                                }}
                            >
                                <div>
                                    <h4 className="font-bold text-lg">{scheme.title}</h4>
                                    <p className="text-xs text-white/70">{scheme.desc}</p>
                                </div>
                                <ArrowRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FarmerNegotiations farmerId={userData?._id!} />

            {/* AI Quality Inspector */}
            <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-zinc-100 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-50" />

                <div className="relative z-10 space-y-12">
                    <div className="flex items-center gap-3 text-green-600 font-black uppercase tracking-[0.4em] text-[10px] bg-green-50 w-fit px-4 py-1.5 rounded-full border border-green-100">
                        <Sparkles size={14} className="animate-pulse" />
                        <span>Collective Neural Inspector</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter leading-tight">Aggregate Quality <br />AI Validation</h2>
                            <p className="text-zinc-500 font-medium text-lg leading-relaxed max-w-md">
                                Assess the quality of collected produce batches before listing. Ensure community output meets premium marketplace standards.
                            </p>

                            <div className="flex items-center gap-8 group/stats">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Dataset</div>
                                    <div className="text-xl font-black text-zinc-800">12M+ Data points</div>
                                </div>
                                <div className="w-px h-8 bg-zinc-200" />
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Accuracy</div>
                                    <div className="text-xl font-black text-green-600">99.2% Validated</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-6">
                                <label htmlFor="shg-crop-upload" className="cursor-pointer block">
                                    <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-green-500/50 hover:bg-green-50 transition-all rounded-[3rem] p-10 text-center min-h-[350px] flex flex-col items-center justify-center group/upload relative overflow-hidden shadow-inner">
                                        {cropPreview ? (
                                            <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden">
                                                <img src={cropPreview} alt="Crop" className="w-full h-full object-cover group-hover/upload:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-black/20 group-hover/upload:bg-black/40 transition-colors" />
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setCropPreview(null); setCropImage(null); setAnalysisResult(null); }}
                                                    className="absolute top-4 right-4 bg-white/90 text-red-500 p-2.5 rounded-full hover:scale-110 transition-transform shadow-2xl z-20"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-zinc-100 group-hover/upload:scale-110 transition-transform">
                                                    <Upload className="text-green-600" size={40} />
                                                </div>
                                                <p className="text-zinc-900 font-black text-xl mb-2 tracking-tight">Audit Produce Lot</p>
                                                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Upload batch sample for AI Grading</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="shg-crop-upload"
                                    accept="image/*"
                                    onChange={handleCropImageChange}
                                    className="hidden"
                                />

                                {cropImage && !analyzing && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={analyzeCrop}
                                        className="w-full bg-zinc-900 text-white px-8 py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm hover:shadow-2xl transition-all flex items-center justify-center gap-4 border border-white/10"
                                    >
                                        <span>Run Audit Analysis</span>
                                        <Zap size={20} className="fill-current text-green-400" />
                                    </motion.button>
                                )}

                                {analyzing && (
                                    <div className="w-full bg-zinc-50 px-8 py-6 rounded-[2rem] flex items-center justify-center gap-4 text-green-600 font-black uppercase tracking-[0.3em] text-sm border border-green-100">
                                        <Loader className="animate-spin" size={24} />
                                        <span>Quantifying Samples...</span>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {analysisResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-zinc-900 p-8 rounded-[3rem] border border-white/10 shadow-3xl space-y-8"
                                    >
                                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 shadow-xl">
                                                    {analysisResult.health === "Healthy" ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Lot Analysis</p>
                                                    <p className="text-xl font-black text-white tracking-tight">{analysisResult.cropType}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 px-4 py-2 rounded-xl text-green-400 font-black text-xs uppercase tracking-widest border border-green-500/20">
                                                SHG Grade Verified
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Aggregate Status</span>
                                                <div className={`text-lg font-black ${analysisResult.health === 'Healthy' ? 'text-green-400' : 'text-amber-400'}`}>
                                                    {analysisResult.health}
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-right">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Market Score</span>
                                                <div className="text-lg font-black text-green-400">
                                                    {analysisResult.grade} (A+)
                                                </div>
                                            </div>
                                        </div>

                                        {analysisResult.issues && analysisResult.issues.length > 0 && (
                                            <div className="pt-6 border-t border-white/5 bg-red-500/5 -mx-8 -mb-8 p-8 rounded-b-[3rem]">
                                                <p className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-4 flex items-center gap-2">
                                                    <AlertTriangle size={14} /> Batch Observations
                                                </p>
                                                <ul className="space-y-3">
                                                    {analysisResult.issues.map((issue: string, i: number) => (
                                                        <li key={i} className="text-sm text-zinc-300 font-medium flex items-start gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                                            <span className="text-red-500 font-bold">•</span>
                                                            <span>{issue}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Listings Section */}
                <div className="space-y-10">
                    <div className="flex items-end justify-between">
                        <div className="space-y-3">
                            <h2 className='text-4xl font-black text-zinc-900 tracking-tight'>Community Inventory</h2>
                            <p className="text-zinc-500 font-medium text-lg">Active produces aggregated from your SHG members.</p>
                        </div>
                        <motion.button
                            id="shg-add"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl shadow-green-900/20"
                            onClick={() => setShowAddCrop(true)}
                        >
                            <Plus size={20} />
                            <span>Add Community Produce</span>
                        </motion.button>
                    </div>

                    <div id="shg-portfolio">
                        {crops.length === 0 ? (
                            <div className="py-32 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-zinc-200 shadow-sm">
                                <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <History className="text-zinc-200" size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-800 mb-2 tracking-tight">No Active Inventory</h3>
                                <p className="text-zinc-400 font-medium">Add produce collected from your community farmers.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {Array.isArray(crops) && crops.map((crop, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-2xl shadow-green-900/5 group relative flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 bg-green-50 rounded-[1.5rem] flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden">
                                                {crop.image ? (
                                                    <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Sprout size={32} />
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase text-zinc-300 tracking-widest leading-none">ID</div>
                                                <div className="text-xs font-black text-zinc-900 mt-1">{crop.farmId}</div>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-zinc-900 mb-6 tracking-tight group-hover:text-green-600 transition-colors uppercase">{crop.name}</h3>

                                        <div className="space-y-4 mt-auto">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                                <Calendar size={12} />
                                                <span>Collection Date: {crop.harvestDate}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                                                <div>
                                                    <div className="text-[10px] font-black uppercase text-zinc-400">Net Volume</div>
                                                    <div className="text-xl font-black text-zinc-900 leading-none mt-1">{crop.quantity} {crop.unit}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black uppercase text-zinc-400">Bulk Rate</div>
                                                    <div className="text-xl font-black text-green-600 leading-none mt-1">₹{crop.price}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteCrop(crop._id)
                                            }}
                                            className="absolute top-4 right-4 bg-white p-2 rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
                                            title="Remove Record"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Aggregation Modal */}
            <AnimatePresence>
                {showAddCrop && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xl"
                            onClick={() => setShowAddCrop(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-white p-12 rounded-[4rem] max-w-lg w-full m-4 shadow-3xl relative z-110 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-400 to-emerald-600" />

                            <button
                                onClick={() => setShowAddCrop(false)}
                                className="absolute top-10 right-10 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-50 p-2 rounded-full"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                    <Fingerprint size={12} />
                                    <span>SHG Collective Protocol</span>
                                </div>
                                <h3 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">Aggregate Produce</h3>
                                <p className="text-zinc-500 font-medium">Log community collections into the marketplace.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Image Upload */}
                                    <div className="mb-4 flex flex-col items-center justify-center">
                                        <label htmlFor="cropImage" className="cursor-pointer w-full h-40 bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-[1.5rem] flex flex-col items-center justify-center hover:bg-zinc-100 transition-all overflow-hidden group relative">
                                            {newCrop.imagePreview ? (
                                                <img src={newCrop.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Upload className="text-zinc-400 group-hover:text-green-500 mb-2" size={32} />
                                                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Upload Photo</span>
                                                </>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            id="cropImage"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    // Technical Validation: Size check
                                                    if (file.size > 5 * 1024 * 1024) {
                                                        toast.error(t('errorTooLarge'))
                                                        return
                                                    }

                                                    const img = new Image()
                                                    img.src = URL.createObjectURL(file)
                                                    img.onload = () => {
                                                        setNewCrop({
                                                            ...newCrop,
                                                            image: file,
                                                            imagePreview: URL.createObjectURL(file)
                                                        })
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <Sprout className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Crop Variety"
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 focus:bg-white transition-all font-bold text-sm"
                                                value={newCrop.name}
                                                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                            <select
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-10 outline-none font-bold text-sm"
                                                value={newCrop.category}
                                                onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                                            >
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                        <input
                                            type="number"
                                            placeholder="Total Volume"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 font-bold text-sm"
                                            value={newCrop.quantity}
                                            onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-zinc-400 text-xs">₹</div>
                                        <input
                                            type="number"
                                            placeholder="Bulk Rate"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 font-bold text-sm"
                                            value={newCrop.price}
                                            onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <div className="absolute top-4 left-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">SHG ID</div>
                                        <input
                                            readOnly
                                            className="w-full bg-zinc-100 border border-zinc-200 rounded-[1.5rem] pt-8 pb-4 px-5 text-zinc-500 font-black text-xs"
                                            value={newCrop.farmId}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute top-4 left-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Collected</div>
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] pt-8 pb-4 px-5 text-zinc-800 font-bold text-xs"
                                            value={newCrop.harvestDate}
                                            onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Authenticity Declaration Block */}
                                <div className="p-6 bg-amber-50 rounded-[1.5rem] border border-amber-100 space-y-4">
                                    <div className="flex gap-4">
                                        <input
                                            type="checkbox"
                                            id="shg-authenticity-check"
                                            className="mt-1 w-5 h-5 rounded border-zinc-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                            checked={isAuthentic}
                                            onChange={(e) => setIsAuthentic(e.target.checked)}
                                        />
                                        <label htmlFor="shg-authenticity-check" className="text-[11px] font-bold text-zinc-600 cursor-pointer leading-tight">
                                            {t('declarationText')}
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-amber-700 font-black uppercase tracking-widest pl-9">
                                        <Info size={14} />
                                        <span>{t('requirements')}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-zinc-900 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[1.5rem] shadow-2xl flex items-center justify-center gap-4 mt-8 transition-all hover:bg-green-600"
                                    disabled={loading}
                                    onClick={async () => {
                                        if (!isAuthentic) {
                                            toast.error(t('errorNoDeclaration'));
                                            return;
                                        }
                                        if (newCrop.name && newCrop.quantity && newCrop.price) {
                                            try {
                                                setLoading(true)
                                                const formData = new FormData();
                                                formData.append("name", newCrop.name);
                                                formData.append("quantity", newCrop.quantity);
                                                formData.append("price", newCrop.price);
                                                formData.append("category", newCrop.category);
                                                formData.append("unit", newCrop.unit);
                                                formData.append("farmId", newCrop.farmId);
                                                formData.append("harvestDate", newCrop.harvestDate);
                                                if (newCrop.image) formData.append("image", newCrop.image);

                                                const res = await axios.post('/api/farmer/add-product', formData)
                                                setCrops([...crops, res.data.product])
                                                setShowAddCrop(false)
                                                setIsAuthentic(false)
                                                toast.success('Collective Record Logged!')
                                            } catch (error: any) {
                                                toast.error('Logging failed')
                                            } finally {
                                                setLoading(false)
                                            }
                                        }
                                    }}
                                >
                                    {loading ? <Loader className="animate-spin" /> : (
                                        <>
                                            <span>Broadcast to Network</span>
                                            <Send className="w-5 h-5 text-green-400" />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <TutorialGuide steps={SHG_TOUR_STEPS} tourName="shg_v1" />
            <div id="tour-voice" className="fixed bottom-10 right-10 w-1 h-1 pointer-events-none" />
        </div>
    )
}

export default SHGDashboard

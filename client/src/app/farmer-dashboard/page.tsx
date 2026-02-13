'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { RootState } from '@/redux/store'
import {
    Loader, TrendingUp, DollarSign, Plus, Sparkles, Sprout, Briefcase,
    Zap, X, MapPin, ArrowRight, ShieldCheck, History, Info, Edit, Gavel,
    Calendar, Fingerprint, Activity, LineChart as ChartIcon, Package, Upload, Trash2, Send, Users, CheckCircle, AlertCircle, AlertTriangle, XCircle
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

const MOCK_TRENDS = [
    { name: 'Week 1', price: 42 },
    { name: 'Week 2', price: 45 },
    { name: 'Week 3', price: 43 },
    { name: 'Week 4', price: 48 },
    { name: 'Week 5', price: 52 },
    { name: 'Week 6', price: 50 },
    { name: 'Week 7', price: 55 },
]

const FARMER_TOUR_STEPS = [
    {
        targetId: 'tour-header',
        title: 'Welcome to your Hub',
        content: 'This is your central command center. You can manage your profile, switch roles, or go back home using the top navigation.'
    },
    {
        targetId: 'tour-analytics',
        title: 'Digital Harvest Guide',
        content: 'Use our AI to simulate market prices. Just enter the region and crop variety to see high-accuracy forecasts based on real-time data.'
    },
    {
        targetId: 'tour-add',
        title: 'List your Harvest',
        content: 'Record your latest harvest here. Adding your produce with origin details ensures legal compliance and builds trust with buyers.'
    },
    {
        targetId: 'tour-ledger',
        title: 'Digital Harvest Log',
        content: 'Track every batch you’ve listed. You can see verification status and remove listings if they’re sold out.'
    },
    {
        targetId: 'tour-voice',
        title: 'Voice Commands',
        content: 'Prefer talking? Use our AI-Voice assistant to "Open the form" or "Run analysis" hands-free!'
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

function FarmerDashboard() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [region, setRegion] = useState('')
    const [quantity, setQuantity] = useState('')
    const [crop, setCrop] = useState('')
    const [prediction, setPrediction] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [showAddCrop, setShowAddCrop] = useState(false)
    const [newCrop, setNewCrop] = useState<{
        name: string, quantity: string, price: string, category: string, unit: string, farmId: string, harvestDate: string, image: File | null, imagePreview: string | null, fssaiLicense: string, originState: string, originCity: string, isGITagged: boolean, giCertificationId: string
    }>({
        name: '', quantity: '', price: '', category: 'Raw Millets', unit: 'kg', farmId: 'FARM-' + Math.floor(Math.random() * 9000 + 1000), harvestDate: new Date().toISOString().split('T')[0], image: null, imagePreview: null, fssaiLicense: '', originState: 'Haryana', originCity: '', isGITagged: false, giCertificationId: ''
    })
    const [crops, setCrops] = useState<Array<any>>([])
    const [selectedScheme, setSelectedScheme] = useState<string | null>(null)
    const [cropImage, setCropImage] = useState<File | null>(null)
    const [cropPreview, setCropPreview] = useState<string | null>(null)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [editingCrop, setEditingCrop] = useState<any | null>(null)
    const [selectedCrop, setSelectedCrop] = useState<any | null>(null)
    const [isAuthentic, setIsAuthentic] = useState(false)
    const t = useTranslations('imageAuthenticity')
    const tf = useTranslations('farmerDashboard')

    const handleVoiceCommand = (command: string) => {
        const cmd = command.toLowerCase()
        if (cmd.includes('add') || cmd.includes('list') || cmd.includes('new') || cmd.includes('harvest')) {
            setShowAddCrop(true)
            toast.success("Voice Command: Opening Listing Form")
        } else if (cmd.includes('close') || cmd.includes('cancel')) {
            setShowAddCrop(false)
            toast.success("Voice Command: Closing Form")
        } else if (cmd.includes('analyze') || cmd.includes('predict')) {
            toast("Please confirm details and click 'Run Simulation'", { icon: '🤖' })
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
            toast.success("Harvest removed from ledger")
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
            toast.success("Intelligence Sync Complete")
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
                toast.success("Crop analysis complete!")
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
        <div className="min-h-screen bg-white dark:bg-background-dark pb-32 pt-[110px] md:pt-[140px] selection:bg-primary/10 selection:text-primary">
            <Nav user={userData as any} />
            <VoiceAssistant onCommand={handleVoiceCommand} />
            <div id="tour-voice" className="fixed bottom-10 right-10 w-1 h-1 pointer-events-none" />
            <TutorialGuide steps={FARMER_TOUR_STEPS} tourName="farmer_v1" />

            <div className="w-[95%] lg:w-[90%] max-w-[1600px] mx-auto space-y-12 md:space-y-20">

                {/* Header Section */}
                <div id="tour-header" className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px] bg-primary/10 dark:bg-emerald-500/10 w-fit px-4 py-1.5 rounded-full border border-primary/20"
                        >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            <span>Mission Control Hub</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]'
                        >
                            Grow. <span className="text-zinc-300 dark:text-zinc-600">Predict.</span> <br />Scale.
                        </motion.h1>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl font-medium text-lg leading-relaxed">
                            Empowering organic farmers with AI-driven market intelligence, Global standard traceability, and direct access to global marketplaces.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/tools/contract-hub">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-slate-900 dark:bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs shadow-2xl agrow-glow flex items-center gap-3 border border-white/10"
                                >
                                    <Gavel size={18} className="text-primary dark:text-white" />
                                    <span>Institutional Contract Hub</span>
                                </motion.button>
                            </Link>
                            <Link href="/tools/crop-doctor">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs shadow-xl flex items-center gap-3 border border-zinc-200 dark:border-zinc-700"
                                >
                                    <Activity size={18} className="text-primary" />
                                    <span>Crop Health Clinic</span>
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <div className="w-full sm:w-[350px] glass-panel p-2 rounded-[2.5rem] shadow-2xl">
                            <WeatherCard />
                        </div>
                        <div className="glass-panel p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 h-fit border border-white/20">
                            <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary shadow-inner">
                                <Activity size={32} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Yield Integrity</div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">98.4%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AI Price Predictor Card */}
                    <motion.div
                        id="tour-analytics"
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 glass-panel p-8 md:p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group border border-white/20"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />

                        <div className="relative">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-slate-900 dark:bg-primary rounded-[1.8rem] flex items-center justify-center shadow-2xl agrow-glow">
                                        <Zap className="text-primary dark:text-white" size={32} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Intelligence Ledger</h2>
                                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Blockchain Analysis v3.4</p>
                                    </div>
                                </div>
                                <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 flex items-center gap-2 w-fit">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                                    Live Processing
                                </div>
                            </div>

                            <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="relative group/input">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/input:text-primary transition-colors" size={20} />
                                    <input
                                        placeholder="Target Region"
                                        aria-label="Target Region"
                                        className="w-full bg-white/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.8rem] py-6 pl-16 pr-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-sm"
                                        value={region} onChange={e => setRegion(e.target.value)}
                                    />
                                </div>
                                <div className="relative group/input">
                                    <Sprout className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/input:text-primary transition-colors" size={20} />
                                    <input
                                        placeholder="Crop Variety"
                                        aria-label="Crop Variety"
                                        className="w-full bg-white/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.8rem] py-6 pl-16 pr-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-sm"
                                        value={crop} onChange={e => setCrop(e.target.value)}
                                    />
                                </div>
                                <div className="relative group/input">
                                    <TrendingUp className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/input:text-primary transition-colors" size={20} />
                                    <input
                                        placeholder="Volume (kg)"
                                        type="number"
                                        aria-label="Volume in kg"
                                        className="w-full bg-white/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.8rem] py-6 pl-16 pr-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-sm"
                                        value={quantity} onChange={e => setQuantity(e.target.value)}
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="bg-slate-900 dark:bg-primary text-white py-6 rounded-[1.8rem] md:col-span-3 font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:shadow-2xl agrow-glow transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader className="animate-spin" /> : (
                                        <>
                                            <span>Run Neural Price Simulation</span>
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
                                        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10 bg-slate-950 rounded-[3rem] border border-white/10 shadow-3xl"
                                    >
                                        <div className="space-y-8">
                                            <div className="flex flex-col gap-2">
                                                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 w-fit">
                                                    <ChartIcon size={12} />
                                                    <span>Simulation Outcome</span>
                                                </div>
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-indigo-500/20 w-fit">
                                                    <Sparkles size={10} />
                                                    <span>AI-Generated Insight</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Estimated Market Rate</div>
                                                <div className="text-7xl font-black text-white tracking-tighter leading-none">₹{prediction.estimatedPrice}<span className="text-xl text-primary font-bold ml-1">/kg</span></div>
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <div className="bg-white/5 p-5 rounded-[1.5rem] flex-1 border border-white/5">
                                                    <div className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-1">Price Sentiment</div>
                                                    <div className="text-primary font-black uppercase tracking-[0.1em] text-sm">Bullish Trend</div>
                                                </div>
                                                <div className="bg-white/5 p-5 rounded-[1.5rem] flex-1 border border-white/5">
                                                    <div className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-1">AI Confidence</div>
                                                    <div className="text-white font-black uppercase tracking-[0.1em] text-sm">92.8% Verified</div>
                                                </div>
                                            </div>
                                            <p className="text-zinc-400 font-medium leading-relaxed italic border-l-4 border-primary/40 pl-6 text-sm">
                                                {prediction.advice}
                                            </p>
                                        </div>
                                        <div className="h-[280px] w-full relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={MOCK_TRENDS}>
                                                    <defs>
                                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#11d462" stopOpacity={0.4} />
                                                            <stop offset="95%" stopColor="#11d462" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px' }}
                                                        itemStyle={{ color: '#11d462', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                                                    />
                                                    <Area type="monotone" dataKey="price" stroke="#11d462" strokeWidth={5} fillOpacity={1} fill="url(#colorPrice)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-72 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-white/10">
                                        <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-xl mb-6 text-zinc-300 dark:text-zinc-600 transition-transform hover:rotate-12">
                                            <ChartIcon size={36} />
                                        </div>
                                        <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">Await Neural Simulation</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <DemandHeatmap />
                    <MarketPricesWidget />
                </div>

                {/* Government Support Programs */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 md:p-12 rounded-[3.5rem] text-white shadow-2xl shadow-green-900/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-white/80 font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                            <Briefcase size={16} />
                            <span>Government Initiatives</span>
                        </div>

                        {/* Support Programs Section */}
                        <div className="lg:col-span-3 glass-panel p-10 md:p-16 rounded-[4rem] border border-white/20 shadow-3xl relative overflow-hidden group">
                            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-[100px] opacity-20" />

                            <div className="relative z-10 space-y-12">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.4em] text-[10px]">
                                            <Briefcase size={14} />
                                            <span>Economic Empowerment</span>
                                        </div>
                                        <h3 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
                                            Direct Support <br /><span className="text-zinc-300 dark:text-zinc-700">Protocols</span>
                                        </h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg max-w-xl">
                                            Access exclusive government mandates and premium institutional contracts tailored for organic millet production.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => window.open('https://enam.gov.in/web/dashboard/historical-data', '_blank')}
                                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:shadow-2xl transition-all w-fit"
                                        >
                                            View Global Directory
                                        </motion.button>
                                        <Link href="/tools/contract-hub">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-primary hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:shadow-2xl transition-all w-fit flex items-center gap-3 border border-white/20"
                                            >
                                                <Gavel size={16} />
                                                <span>Draft Legal Agreement</span>
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { id: 'PM_POSHAN', title: 'PM POSHAN', premium: '15% Premium', desc: 'Secure high-value contracts for national nutritional program logistics.' },
                                        { id: 'RATIONS', title: 'PDS / Ration', premium: 'Guaranteed Buy', desc: 'Join the direct procurement pipeline for nationwide grain distribution.' },
                                        { id: 'EXPORT', title: 'Export Subsidy', premium: '20% Incentive', desc: 'Financial support for high-volume international shipments and certifications.' }
                                    ].map((scheme) => (
                                        <motion.div
                                            key={scheme.id}
                                            whileHover={{ y: -5, borderColor: 'rgba(16, 185, 129, 0.4)' }}
                                            className="p-8 bg-white/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] cursor-pointer group backdrop-blur-md transition-all flex flex-col justify-between h-full"
                                            onClick={() => setSelectedScheme(scheme.id)}
                                        >
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/20">
                                                        {scheme.premium}
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                        <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{scheme.title}</h4>
                                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{scheme.desc}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News & Schemes Resource Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px] h-auto">
                    <NewsCard />
                    <SchemesCard />
                </div>

                {/* Crop Quality Analysis */}
                <div className="glass-panel p-10 md:p-16 rounded-[4rem] border border-white/20 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 opacity-50" />

                    <div className="relative z-10 space-y-12">
                        <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px] bg-primary/10 w-fit px-4 py-1.5 rounded-full border border-primary/20">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>Neural Quality Inspector</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">Harvest Quality <br />AI Validation</h2>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg leading-relaxed max-w-md">
                                    Our proprietary computer vision model assesses crop health, color grade, and ripeness to ensure legal compliance and marketplace premium.
                                </p>

                                <div className="flex items-center gap-8 group/stats">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Dataset</div>
                                        <div className="text-xl font-black text-slate-800 dark:text-zinc-300">12M+ Data points</div>
                                    </div>
                                    <div className="w-px h-8 bg-zinc-200 dark:bg-white/10" />
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Accuracy</div>
                                        <div className="text-xl font-black text-primary">99.2% Validated</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                {/* Upload Section */}
                                <div className="space-y-6">
                                    <label htmlFor="crop-upload" className="cursor-pointer block">
                                        <div className="bg-white/5 dark:bg-white/5 border-2 border-dashed border-zinc-200 dark:border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all rounded-[3rem] p-10 text-center min-h-[350px] flex flex-col items-center justify-center group/upload relative overflow-hidden shadow-inner">
                                            {cropPreview ? (
                                                <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden">
                                                    <img src={cropPreview} alt="Crop" className="w-full h-full object-cover group-hover/upload:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-black/20 group-hover/upload:bg-black/40 transition-colors" />
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); setCropPreview(null); setCropImage(null); setAnalysisResult(null); }}
                                                        className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-red-500 p-2.5 rounded-full hover:scale-110 transition-transform shadow-2xl z-20"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-primary/20 group-hover/upload:scale-110 transition-transform">
                                                        <Upload className="text-primary" size={40} />
                                                    </div>
                                                    <p className="text-slate-900 dark:text-white font-black text-xl mb-2 tracking-tight">Upload Visual Evidence</p>
                                                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Lossless RAW / JPEG / PNG supported</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        id="crop-upload"
                                        accept="image/*"
                                        onChange={handleCropImageChange}
                                        className="hidden"
                                    />

                                    {cropImage && !analyzing && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={analyzeCrop}
                                            className="w-full bg-slate-900 dark:bg-primary text-white px-8 py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm hover:shadow-2xl agrow-glow transition-all flex items-center justify-center gap-4 border border-white/10"
                                        >
                                            <span>Run Neural Diagnosis</span>
                                            <Zap size={20} className="fill-current" />
                                        </motion.button>
                                    )}

                                    {analyzing && (
                                        <div className="w-full bg-slate-900/5 dark:bg-white/5 px-8 py-6 rounded-[2rem] flex items-center justify-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-sm border border-primary/20">
                                            <Loader className="animate-spin" size={24} />
                                            <span>Analyzing Tissues...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Results Section */}
                                <AnimatePresence mode="wait">
                                    {analysisResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-950 p-8 rounded-[3rem] border border-white/10 shadow-3xl space-y-8"
                                        >
                                            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${analysisResult.isValidCrop === false ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                                                        {analysisResult.isValidCrop === false ? <XCircle size={28} /> : (analysisResult.health === "Healthy" ? <CheckCircle size={28} /> : <AlertCircle size={28} />)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Detected Strain</p>
                                                        <p className="text-xl font-black text-white tracking-tight">{analysisResult.cropType}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-indigo-500/20 px-3 py-1.5 rounded-lg text-indigo-400 font-black text-[9px] uppercase tracking-[0.2em] border border-indigo-500/30 flex items-center gap-2">
                                                    <Sparkles size={12} />
                                                    AI-Generated Insight
                                                </div>
                                                <div className="bg-white/5 px-4 py-2 rounded-xl text-primary font-black text-xs uppercase tracking-widest border border-primary/20">
                                                    AgrowCart Certified
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Biological Status</span>
                                                    <div className={`text-lg font-black ${analysisResult.health === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                        {analysisResult.health}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-right">
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Market Grade</span>
                                                    <div className={`text-lg font-black ${analysisResult.isValidCrop === false ? 'text-zinc-500' : 'text-primary'}`}>
                                                        {analysisResult.grade} {analysisResult.isValidCrop !== false && analysisResult.grade === 'Premium' && '(A+)'}
                                                    </div>
                                                </div>
                                            </div>

                                            {analysisResult.issues && analysisResult.issues.length > 0 && (
                                                <div className="pt-6 border-t border-white/5 bg-red-500/5 -mx-8 -mb-8 p-8 rounded-b-[3rem]">
                                                    <p className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-4 flex items-center gap-2">
                                                        <AlertTriangle size={14} /> Critical Observations
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
                </div>

                <FarmerNegotiations farmerId={userData?._id!} />

                {/* Digital Ledger Section */}
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
                                <ShieldCheck size={14} className="animate-pulse" />
                                <span>Blockchain Verified Inventory</span>
                            </div>
                            <h2 className='text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter'>Digital Ledger</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl font-medium text-lg">Manage your traceable inventory active in the global premium marketplace.</p>
                        </div>
                        <motion.button
                            id="tour-add"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-slate-900 dark:bg-primary text-white px-10 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm flex items-center gap-4 shadow-3xl agrow-glow w-fit"
                            onClick={() => setShowAddCrop(true)}
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span>List New Harvest</span>
                        </motion.button>
                    </div>

                    {crops.length === 0 ? (
                        <div className="py-32 text-center glass-panel rounded-[4rem] border-2 border-dashed border-zinc-200 dark:border-white/10 shadow-sm">
                            <div className="w-24 h-24 bg-zinc-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <History className="text-zinc-200 dark:text-zinc-700" size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-zinc-800 dark:text-zinc-300 mb-2 tracking-tight uppercase tracking-widest">Empty Granary</h3>
                            <p className="text-zinc-400 font-medium">Broadcast your produce to secure premium bulk buyer orders.</p>
                        </div>
                    ) : (
                        <div id="tour-ledger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                            {Array.isArray(crops) && crops.map((crop, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -10 }}
                                    viewport={{ once: true }}
                                    className="glass-panel p-6 rounded-[3rem] border border-white/20 dark:border-white/5 shadow-2xl shadow-zinc-900/5 group relative flex flex-col h-full hover:border-primary/40 transition-all duration-500 cursor-pointer"
                                    onClick={() => setSelectedCrop(crop)}
                                >
                                    <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-6 bg-zinc-50 dark:bg-white/5">
                                        {crop.image ? (
                                            <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-200 dark:text-zinc-800">
                                                <Sprout size={64} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                            <span className="text-[8px] font-black text-white uppercase tracking-widest">Verified</span>
                                        </div>
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingCrop(crop);
                                                    setNewCrop({
                                                        name: crop.name,
                                                        quantity: String(crop.stock || 0),
                                                        price: crop.price,
                                                        category: crop.category,
                                                        unit: crop.unit,
                                                        farmId: crop.farmId,
                                                        harvestDate: new Date(crop.harvestDate).toISOString().split('T')[0],
                                                        image: null,
                                                        imagePreview: crop.image,
                                                        fssaiLicense: crop.fssaiLicense || '',
                                                        originState: crop.originState || 'Haryana',
                                                        originCity: crop.originCity || '',
                                                        isGITagged: crop.isGITagged || false,
                                                        giCertificationId: crop.giCertificationId || ''
                                                    });
                                                    setShowAddCrop(true);
                                                }}
                                                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-2.5 rounded-full text-zinc-400 hover:text-primary transition-all shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteCrop(crop._id)
                                                }}
                                                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-2.5 rounded-full text-zinc-400 hover:text-red-500 transition-all shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10 uppercase tracking-widest">
                                                {crop.category || 'Millet'}
                                            </span>
                                            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                                {crop.farmId}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                            {crop.name}
                                        </h3>

                                        <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-white/5 grid grid-cols-2 gap-4">
                                            <div className="mb-4">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <div className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Supply Velocity</div>
                                                    <div className="text-[9px] font-black text-primary uppercase tracking-widest">Active</div>
                                                </div>
                                                <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: '85%' }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-full bg-linear-to-r from-primary to-emerald-400 rounded-full"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Inventory</div>
                                                <div className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                                                    {crop.stock}<span className="text-[10px] ml-0.5">{crop.unit}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Fixed Rate</div>
                                                <div className="text-lg font-black text-primary leading-none tracking-tighter">
                                                    ₹{crop.price}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {showAddCrop && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xl"
                            onClick={() => { setShowAddCrop(false); setEditingCrop(null); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-white p-6 md:p-8 rounded-[2.5rem] max-w-lg w-full shadow-3xl relative z-110 max-h-[90vh] overflow-y-auto custom-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-green-400 to-emerald-600" />

                            <button
                                onClick={() => { setShowAddCrop(false); setEditingCrop(null); }}
                                className="absolute top-6 right-6 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-50 p-2 rounded-full z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                                    <Fingerprint size={10} />
                                    <span>AgrowCart Traceability Protocol</span>
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 tracking-tighter mb-1">{editingCrop ? 'Update Produce' : 'New Produce Log'}</h3>
                                <p className="text-zinc-500 text-xs font-medium">{editingCrop ? 'Modify your existing harvest details.' : 'Register your harvest on the blockchain-ready ledger.'}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Image Upload */}
                                    <div className="flex flex-col items-center justify-center">
                                        <label htmlFor="cropImage" className="cursor-pointer w-full h-32 bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-2xl flex flex-col items-center justify-center hover:bg-zinc-100 transition-all overflow-hidden group relative">
                                            {newCrop.imagePreview ? (
                                                <img src={newCrop.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Upload className="text-zinc-400 group-hover:text-green-500 mb-2" size={24} />
                                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Upload Photo</span>
                                                </>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-[10px] uppercase tracking-widest">Change Image</div>
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <Sprout className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Crop e.g. Foxtail Millet"
                                                className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-800 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500 outline-none transition-all font-bold text-xs"
                                                value={newCrop.name}
                                                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                            <select
                                                className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-zinc-800 dark:text-white outline-none font-bold text-xs appearance-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500 transition-all cursor-pointer"
                                                value={newCrop.category}
                                                onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                                            >
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                        <input
                                            type="number"
                                            placeholder="Volume"
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-800 dark:text-white outline-none font-bold text-xs"
                                            value={newCrop.quantity}
                                            onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-zinc-400 text-[10px]">₹</div>
                                        <input
                                            type="number"
                                            placeholder="Rate/kg"
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-zinc-800 dark:text-white outline-none font-bold text-xs"
                                            value={newCrop.price}
                                            onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                        <input
                                            placeholder="State"
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 px-5 text-zinc-800 dark:text-white outline-none font-bold text-xs"
                                            value={newCrop.originState}
                                            onChange={(e) => setNewCrop({ ...newCrop, originState: e.target.value })}
                                        />
                                        <input
                                            placeholder="City/Village"
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 px-5 text-zinc-800 dark:text-white outline-none font-bold text-xs"
                                            value={newCrop.originCity}
                                            onChange={(e) => setNewCrop({ ...newCrop, originCity: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group md:col-span-2">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                        <input
                                            placeholder="FSSAI License (Optional for Farmers)"
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-800 dark:text-white outline-none font-bold text-xs"
                                            value={newCrop.fssaiLicense}
                                            onChange={(e) => setNewCrop({ ...newCrop, fssaiLicense: e.target.value })}
                                        />
                                    </div>

                                    {/* GI Tag Certification Section */}
                                    <div className="md:col-span-2 p-5 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-200 dark:border-amber-500/20 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600">
                                                    <Sparkles size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">Geographical Indication</p>
                                                    <p className="text-[9px] font-bold text-amber-600/70 dark:text-amber-400/50 uppercase tracking-widest">GI Tag Certification</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer transition-all"
                                                checked={newCrop.isGITagged}
                                                onChange={(e) => setNewCrop({ ...newCrop, isGITagged: e.target.checked })}
                                            />
                                        </div>

                                        {newCrop.isGITagged && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="relative group"
                                            >
                                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={14} />
                                                <input
                                                    placeholder="Enter GI Certification ID (e.g. GI-TN-2023-01)"
                                                    className="w-full bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-500/30 rounded-xl py-3 pl-11 pr-4 text-zinc-800 dark:text-white outline-none font-bold text-[10px] focus:border-amber-500 transition-all uppercase tracking-widest"
                                                    value={newCrop.giCertificationId}
                                                    onChange={(e) => setNewCrop({ ...newCrop, giCertificationId: e.target.value })}
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <div className="absolute top-3 left-4 text-[8px] font-black text-zinc-400 uppercase tracking-widest pointer-events-none">Farm ID</div>
                                        <input
                                            readOnly
                                            className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl pt-6 pb-2.5 px-4 text-zinc-500 font-black text-[10px] cursor-default"
                                            value={newCrop.farmId}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute top-3 left-4 text-[8px] font-black text-zinc-400 uppercase tracking-widest pointer-events-none">Harvested</div>
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl pt-6 pb-2.5 px-4 text-zinc-800 dark:text-white font-bold text-xs outline-none cursor-pointer"
                                            value={newCrop.harvestDate}
                                            onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Authenticity Declaration Block */}
                                <div className="p-5 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10 space-y-3">
                                    <div className="flex gap-3">
                                        <input
                                            type="checkbox"
                                            id="authenticity-check"
                                            className="mt-1 w-4 h-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                            checked={isAuthentic}
                                            onChange={(e) => setIsAuthentic(e.target.checked)}
                                        />
                                        <label htmlFor="authenticity-check" className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer leading-tight">
                                            {t('declarationText')}
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-amber-700 dark:text-amber-500 font-extrabold uppercase tracking-widest pl-7">
                                        <Info size={12} />
                                        <span>{t('requirements')}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full bg-zinc-900 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-3 mt-4 transition-all hover:bg-green-600 border border-white/10 text-xs"
                                    disabled={loading}
                                    onClick={async () => {
                                        if (!isAuthentic && !editingCrop) {
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
                                                formData.append("fssaiLicense", newCrop.fssaiLicense);
                                                formData.append("originState", newCrop.originState);
                                                formData.append("originCity", newCrop.originCity);
                                                formData.append("isGITagged", String(newCrop.isGITagged));
                                                formData.append("giCertificationId", newCrop.giCertificationId);
                                                if (newCrop.image) {
                                                    formData.append("image", newCrop.image);
                                                }

                                                if (editingCrop) {
                                                    formData.append("productId", editingCrop._id);
                                                    const res = await axios.post('/api/farmer/update-product', formData)
                                                    setCrops(crops.map(c => c._id === editingCrop._id ? res.data.product : c))
                                                } else {
                                                    const res = await axios.post('/api/farmer/add-product', formData)
                                                    setCrops([...crops, res.data.product])
                                                }
                                                setShowAddCrop(false)
                                                setEditingCrop(null)
                                                setIsAuthentic(false) // Reset
                                                setNewCrop({
                                                    ...newCrop, name: '', quantity: '', price: '', image: null, imagePreview: null,
                                                    farmId: 'FARM-' + Math.floor(Math.random() * 9000 + 1000),
                                                    isGITagged: false, giCertificationId: ''
                                                })
                                                toast.success(editingCrop ? 'Ledger Updated!' : 'Blockchain Logged & Marketplace Updated!')
                                            } catch (error: any) {
                                                toast.error(error.response?.data?.message || 'Verification failed')
                                            } finally {
                                                setLoading(false)
                                            }
                                        } else {
                                            toast.error('Complete all telemetry fields')
                                        }
                                    }}
                                >
                                    {loading ? <Loader className="animate-spin" /> : (
                                        <>
                                            <span>{editingCrop ? 'Update Listing' : 'Broadcast to Network'}</span>
                                            <Send className="w-4 h-4 text-green-400" />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Scheme Details Modal */}
            <AnimatePresence>
                {selectedScheme && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md"
                            onClick={() => setSelectedScheme(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-3xl relative z-[210] p-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedScheme(null)}
                                className="absolute top-8 right-8 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-50 p-3 rounded-full"
                            >
                                <X size={24} />
                            </button>

                            {selectedScheme === 'PM_POSHAN' ? (
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                                        <Briefcase size={14} />
                                        <span>Government Scheme</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">PM POSHAN Programme</h2>
                                    <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                                        The PM POSHAN (formerly Mid-Day Meal Scheme) aims to improve nutritional levels among school children and boost agricultural markets for millets.
                                    </p>

                                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                        <h3 className="font-black text-green-800 mb-3 flex items-center gap-2">
                                            <ShieldCheck size={20} />
                                            Key Benefits
                                        </h3>
                                        <ul className="space-y-2 text-sm text-green-700 font-medium">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 mt-1">•</span>
                                                <span>15% price premium over market rates</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 mt-1">•</span>
                                                <span>Direct procurement contracts with schools</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 mt-1">•</span>
                                                <span>Guaranteed payment within 30 days</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 mt-1">•</span>
                                                <span>Long-term supply contracts (1-3 years)</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                        <h3 className="font-black text-blue-800 mb-3 flex items-center gap-2">
                                            <Info size={20} />
                                            Eligibility Criteria
                                        </h3>
                                        <ul className="space-y-2 text-sm text-blue-700 font-medium">
                                            <li>✓ Registered farmer with Aadhaar linkage</li>
                                            <li>✓ Minimum 2 acres of millet cultivation</li>
                                            <li>✓ Organic certification (preferred but not mandatory)</li>
                                            <li>✓ Located within 50km of participating schools</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-black text-zinc-800">How to Apply</h3>
                                        <ol className="space-y-2 text-sm text-zinc-700 font-medium">
                                            <li className="flex gap-3">
                                                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                                <span>Register on the PM POSHAN portal with Aadhaar</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                                <span>Upload land documents and crop details</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                                <span>Contact your District Education Officer for verification</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                                <span>Sign supply agreement upon approval</span>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row gap-3">
                                        <a href="https://pmposhan.education.gov.in" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:bg-green-700 transition-all">
                                            Visit Official Portal
                                        </a>
                                        <button className="flex-1 bg-zinc-100 text-zinc-700 px-6 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all">
                                            Download Guidelines (PDF)
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                                        <Briefcase size={14} />
                                        <span>Subsidy Programme</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">PLI Millet Processing Hub</h2>
                                    <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                                        Production Linked Incentive scheme for setting up millet processing units and value-addition infrastructure.
                                    </p>

                                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                        <h3 className="font-black text-purple-800 mb-3 flex items-center gap-2">
                                            <DollarSign size={20} />
                                            Financial Support
                                        </h3>
                                        <ul className="space-y-2 text-sm text-purple-700 font-medium">
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 mt-1">•</span>
                                                <span>40% capital subsidy on machinery (up to ₹50 lakhs)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 mt-1">•</span>
                                                <span>Interest subsidy on working capital loans (3%)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 mt-1">•</span>
                                                <span>Training support for 10 workers per unit</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-600 mt-1">•</span>
                                                <span>Marketing assistance via GeM portal</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                        <h3 className="font-black text-orange-800 mb-3 flex items-center gap-2">
                                            <Info size={20} />
                                            Eligibility
                                        </h3>
                                        <ul className="space-y-2 text-sm text-orange-700 font-medium">
                                            <li>✓ Farmer Producer Organizations (FPOs)</li>
                                            <li>✓ SHG federations with banking linkage</li>
                                            <li>✓ Minimum 50 farmer members</li>
                                            <li>✓ Land availability for processing unit (min 500 sq m)</li>
                                            <li>✓ Project cost between ₹25 lakhs - ₹2 crores</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-black text-zinc-800">Application Process</h3>
                                        <ol className="space-y-2 text-sm text-zinc-700 font-medium">
                                            <li className="flex gap-3">
                                                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                                <span>Form FPO or SHG with minimum members</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                                <span>Prepare Detailed Project Report (DPR)</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                                <span>Submit application to State Nodal Agency</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                                <span>Technical evaluation and site inspection</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                                                <span>Approval and first tranche disbursement (30%)</span>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row gap-3">
                                        <a href="https://pib.gov.in" target="_blank" rel="noopener noreferrer" className="flex-1 bg-purple-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:bg-purple-700 transition-all">
                                            Learn More
                                        </a>
                                        <button className="flex-1 bg-zinc-100 text-zinc-700 px-6 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all">
                                            Contact District Officer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Selected Crop Detail Modal (Expansion) */}
            <AnimatePresence>
                {selectedCrop && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            onClick={() => setSelectedCrop(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-white dark:bg-zinc-900 rounded-[3.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-3xl relative z-[210] flex flex-col md:flex-row border border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedCrop(null)}
                                className="absolute top-8 right-8 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-50 dark:bg-white/5 p-3 rounded-full z-20 shadow-xl"
                            >
                                <X size={24} />
                            </button>

                            <div className="w-full md:w-1/2 h-80 md:h-[600px] relative shrink-0">
                                {selectedCrop.image ? (
                                    <img src={selectedCrop.image} alt={selectedCrop.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                        <Sprout size={100} className="text-zinc-300" />
                                    </div>
                                )}
                                <div className="absolute top-8 left-8 bg-primary/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/20">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Verified Harvest</span>
                                </div>
                            </div>

                            <div className="p-8 md:p-14 flex-1 space-y-10 custom-scrollbar overflow-y-auto">
                                <div>
                                    <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                                        <Fingerprint size={14} />
                                        <span>Inventory ID: {selectedCrop.farmId}</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">
                                        {selectedCrop.name}
                                    </h2>
                                    <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20 w-fit">
                                        {selectedCrop.category}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-zinc-100 dark:border-white/10">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Available Stock</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {selectedCrop.stock}<span className="text-lg ml-1 font-bold text-zinc-400">{selectedCrop.unit}</span>
                                        </p>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Premium Rate</p>
                                        <p className="text-3xl font-black text-primary tracking-tighter">
                                            ₹{selectedCrop.price}<span className="text-lg ml-1 font-bold text-zinc-300">/ {selectedCrop.unit}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-zinc-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-zinc-400">
                                            <Calendar size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Harvested Date</p>
                                            <p className="text-slate-700 dark:text-slate-300 font-bold">{new Date(selectedCrop.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-zinc-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-zinc-400">
                                            <MapPin size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Origin Location</p>
                                            <p className="text-slate-700 dark:text-slate-300 font-bold">{selectedCrop.originCity || 'N/A'}, {selectedCrop.originState}</p>
                                        </div>
                                    </div>
                                    {selectedCrop.fssaiLicense && (
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-zinc-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-zinc-400">
                                                <ShieldCheck size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Legal Certification</p>
                                                <p className="text-slate-700 dark:text-slate-300 font-bold">{selectedCrop.fssaiLicense}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedCrop.isGITagged && (
                                        <div className="flex items-center gap-5 p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10">
                                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600">
                                                <Sparkles size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">GI Tag Verified</p>
                                                <p className="text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-xs">{selectedCrop.giCertificationId}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-10 flex gap-4">
                                    <button
                                        onClick={() => {
                                            const cropToEdit = selectedCrop;
                                            setSelectedCrop(null);
                                            setEditingCrop(cropToEdit);
                                            setNewCrop({
                                                name: cropToEdit.name,
                                                quantity: String(cropToEdit.stock || 0),
                                                price: cropToEdit.price,
                                                category: cropToEdit.category,
                                                unit: cropToEdit.unit,
                                                farmId: cropToEdit.farmId,
                                                harvestDate: new Date(cropToEdit.harvestDate).toISOString().split('T')[0],
                                                image: null,
                                                imagePreview: cropToEdit.image,
                                                fssaiLicense: cropToEdit.fssaiLicense || '',
                                                originState: cropToEdit.originState || 'Haryana',
                                                originCity: cropToEdit.originCity || '',
                                                isGITagged: cropToEdit.isGITagged || false,
                                                giCertificationId: cropToEdit.giCertificationId || ''
                                            });
                                            setShowAddCrop(true);
                                        }}
                                        className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                                    >
                                        <Edit size={16} />
                                        Update Details
                                    </button>
                                    <button
                                        onClick={() => setSelectedCrop(null)}
                                        className="px-10 bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-all border border-zinc-200 dark:border-white/10"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FarmerDashboard




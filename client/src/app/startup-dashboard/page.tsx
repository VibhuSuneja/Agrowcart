'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
    Loader, TrendingUp, DollarSign, Plus, Sparkles, Sprout, Briefcase,
    Zap, X, MapPin, ArrowRight, ShieldCheck, History, Info,
    Calendar, Fingerprint, Activity, LineChart as ChartIcon, Package, Upload, Trash2, Send, Rocket, Lightbulb, Users
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

import toast from 'react-hot-toast'
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

const MOCK_TRENDS = [
    { name: 'Seed Round', price: 1000000 },
    { name: 'Series A', price: 2500000 },
    { name: 'Series B', price: 5000000 },
    { name: 'Bridge', price: 6000000 },
    { name: 'Series C', price: 12000000 },
]

const STARTUP_TOUR_STEPS = [
    {
        targetId: 'startup-header',
        title: 'Innovation Command',
        content: 'Establish your footprint in the Haryana millet ecosystem. From here, you can track your valuation metrics and market impact.'
    },
    {
        targetId: 'startup-analytics',
        title: 'Investor Sentiment AI',
        content: 'Check the viability of your innovative millet products. Our models predict product-market fit to help you refine your B2B pitches.'
    },
    {
        targetId: 'startup-add',
        title: 'Pitch a New MVP',
        content: 'Have a new Agri-Tech solution or a bio-packaging concept? Log your innovation here to make it visible to potential corporate partners.'
    },
    {
        targetId: 'startup-portfolio',
        title: 'Project Portfolio',
        content: 'Manage your active prototypes and MVPs. Keep your inventory updated to maintain high transparency with startup mentors and investors.'
    },
    {
        targetId: 'tour-voice',
        title: 'Smart Startup Controls',
        content: 'Fast-paced environment? Use voice commands to quickly toggle analytics or list new batches without breaking focus.'
    }
]
const CATEGORIES = [
    "Innovative Food",
    "Agri-Tech Device",
    "Supply Chain Solution",
    "Bio-Packaging",
    "Smart Farming AI"
]

function StartupDashboard() {
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
        name: '', quantity: '', price: '', category: 'Innovative Food', unit: 'units', farmId: 'STARTUP-' + Math.floor(Math.random() * 9000 + 1000), harvestDate: new Date().toISOString().split('T')[0], image: null, imagePreview: null
    })
    const [crops, setCrops] = useState<Array<any>>([])
    const [cropImage, setCropImage] = useState<File | null>(null)
    const [cropPreview, setCropPreview] = useState<string | null>(null)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [analyzing, setAnalyzing] = useState(false)

    const handleVoiceCommand = (command: string) => {
        const cmd = command.toLowerCase()
        if (cmd.includes('add') || cmd.includes('pitch') || cmd.includes('new') || cmd.includes('product')) {
            setShowAddCrop(true)
            toast.success("Voice Command: Opening Innovation Log")
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
        if (!confirm("Are you sure you want to remove this innovation listing?")) return
        try {
            await axios.post("/api/admin/delete-product", { productId: id })
            setCrops(crops.filter(c => c._id !== id))
            toast.success("Innovation removed from portfolio")
        } catch (error) {
            toast.error("Failed to delete Listing")
        }
    }

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setPrediction(null)
        try {
            // Reusing millet-price for general market sentiment for now
            const res = await axios.post('/api/ai/millet-price', { region, quantity, crop })
            setPrediction({
                ...res.data,
                estimatedPrice: (parseFloat(res.data.estimatedPrice) * 10).toFixed(2) // Startup scaler
            })
            toast.success("Market Viability Analysis Complete")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Market analysis offline")
        } finally {
            setLoading(false)
        }
    }

    const handleCropImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCropImage(file)
            setCropPreview(URL.createObjectURL(file))
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
                toast.success("Innovation Audit Complete")
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
                <Loader className="animate-spin text-purple-600" size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 pt-[110px] md:pt-[120px] selection:bg-purple-100 selection:text-purple-900">
            <Nav user={userData as any} />
            <VoiceAssistant onCommand={handleVoiceCommand} />
            <div className="w-[95%] md:w-[90%] xl:w-[85%] 2xl:max-w-[1400px] mx-auto space-y-8 md:space-y-12">

                {/* Header Section */}
                <div id="startup-header" className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
                    <div className="space-y-3 md:space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-purple-600 font-black uppercase tracking-[0.3em] text-[10px] bg-purple-50 w-fit px-3 py-1 rounded-lg border border-purple-100"
                        >
                            <Rocket size={14} className="animate-pulse" />
                            <span>Agri-Innovation Hub</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-[0.9] sm:leading-none'
                        >
                            Disrupt. <span className="text-zinc-400">Scale.</span> <br />Impact.
                        </motion.h1>
                        <p className="text-zinc-500 max-w-lg font-medium text-base md:text-lg">Deploy next-gen agricultural solutions and secure partnerships through the marketplace.</p>
                    </div>

                    <div className="flex gap-4 items-end">
                        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-purple-900/5 border border-zinc-100 flex items-center gap-4 h-fit">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <Lightbulb size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase text-zinc-400">Innovation Score</div>
                                <div className="text-xl font-black text-zinc-900">92/100</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AI Viability Predictor Card */}
                    <motion.div
                        id="startup-analytics"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-purple-900/5 border border-zinc-100 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 transition-all group-hover:scale-110" />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-zinc-900/40">
                                        <Zap className="text-purple-400 fill-purple-400" size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Viability Analytics</h2>
                                        <p className="text-zinc-500 text-sm font-medium italic">Market penetration model v3.0</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                                <div className="relative group">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                    <input
                                        placeholder="Target Market"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 focus:bg-white outline-none transition-all font-bold text-sm"
                                        value={region} onChange={e => setRegion(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                    <input
                                        placeholder="Innovation Type"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 focus:bg-white outline-none transition-all font-bold text-sm"
                                        value={crop} onChange={e => setCrop(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                    <input
                                        placeholder="Proj. Unit Sales"
                                        type="number"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 focus:bg-white outline-none transition-all font-bold text-sm"
                                        value={quantity} onChange={e => setQuantity(e.target.value)}
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="bg-zinc-900 text-white py-5 rounded-[1.5rem] md:col-span-3 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-purple-600 transition-all shadow-2xl shadow-zinc-900/20"
                                >
                                    {loading ? <Loader className="animate-spin" /> : (
                                        <><span>Analyze Product Fit</span><Sparkles size={20} /></>
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
                                            <div className="inline-flex items-center gap-3 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                                <ChartIcon size={12} />
                                                <span>Investor Metrics</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm text-zinc-400 font-bold uppercase tracking-widest">Proj. Unit Valuation</div>
                                                <div className="text-6xl font-black text-white tracking-tighter">₹{prediction.estimatedPrice}</div>
                                            </div>
                                            <p className="text-zinc-400 font-medium leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
                                                {prediction.advice}
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 text-zinc-300">
                                            <ChartIcon size={32} />
                                        </div>
                                        <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">Await Valuation</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <div className="h-full">
                        <EventCalendar />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DemandHeatmap />
                    <MarketPricesWidget />
                </div>

                <FarmerNegotiations farmerId={userData?._id!} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <NewsCard />
                    <SchemesCard />
                </div>

                {/* AI Quality Inspector */}
                <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-purple-100 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-50" />

                    <div className="relative z-10 space-y-12">
                        <div className="flex items-center gap-3 text-purple-600 font-black uppercase tracking-[0.4em] text-[10px] bg-purple-50 w-fit px-4 py-1.5 rounded-full border border-purple-100">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>Innovation Neural Auditor</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter leading-tight">Innovation <br />AI Validation</h2>
                                <p className="text-zinc-500 font-medium text-lg leading-relaxed max-w-md">
                                    Audit your prototype's visual fidelity and quality benchmarks using our industrial computer vision suite.
                                </p>

                                <div className="flex items-center gap-8 group/stats">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Dataset</div>
                                        <div className="text-xl font-black text-zinc-800">12M+ Data points</div>
                                    </div>
                                    <div className="w-px h-8 bg-zinc-200" />
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Confidence</div>
                                        <div className="text-xl font-black text-purple-600">99.2% Validated</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-6">
                                    <label htmlFor="startup-crop-upload" className="cursor-pointer block">
                                        <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-purple-500/50 hover:bg-purple-50 transition-all rounded-[3rem] p-10 text-center min-h-[350px] flex flex-col items-center justify-center group/upload relative overflow-hidden shadow-inner">
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
                                                        <Upload className="text-purple-600" size={40} />
                                                    </div>
                                                    <p className="text-zinc-900 font-black text-xl mb-2 tracking-tight">Technical Analysis</p>
                                                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Upload sample for industrial grading</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        id="startup-crop-upload"
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
                                            <span>Initiate Audit</span>
                                            <Zap size={20} className="fill-current text-purple-400" />
                                        </motion.button>
                                    )}

                                    {analyzing && (
                                        <div className="w-full bg-zinc-50 px-8 py-6 rounded-[2rem] flex items-center justify-center gap-4 text-purple-600 font-black uppercase tracking-[0.3em] text-sm border border-purple-100">
                                            <Loader className="animate-spin" size={24} />
                                            <span>Processing Innovation AI...</span>
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
                                                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-xl">
                                                        {analysisResult.health === "Healthy" ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Audit Score</p>
                                                        <p className="text-xl font-black text-white tracking-tight">{analysisResult.cropType}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Viability Status</span>
                                                    <div className={`text-lg font-black ${analysisResult.health === 'Healthy' ? 'text-purple-400' : 'text-amber-400'}`}>
                                                        {analysisResult.health}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-right">
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Purity Score</span>
                                                    <div className="text-lg font-black text-purple-400">
                                                        {analysisResult.grade} (A+)
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listings Section */}
                <div className="space-y-10">
                    <div className="flex items-end justify-between">
                        <div className="space-y-3">
                            <h2 className='text-4xl font-black text-zinc-900 tracking-tight'>Innovation Portfolio</h2>
                            <p className="text-zinc-500 font-medium text-lg">Manage pitch-ready products and MVPs.</p>
                        </div>
                        <motion.button
                            id="startup-add"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-purple-600 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl"
                            onClick={() => setShowAddCrop(true)}
                        >
                            <Plus size={20} />
                            <span>Log Innovation</span>
                        </motion.button>
                    </div>

                    <div id="startup-portfolio">

                        {crops.length === 0 ? (
                            <div className="py-32 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-zinc-200 shadow-sm">
                                <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <History className="text-zinc-200" size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-800 mb-2 tracking-tight">Portfolio Empty</h3>
                                <p className="text-zinc-400 font-medium">Add your innovative products to attract B2B partners.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {Array.isArray(crops) && crops.map((crop, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-2xl group flex flex-col relative"
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center text-purple-600 overflow-hidden">
                                                {crop.image ? (
                                                    <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Rocket size={32} />
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase text-zinc-300">MVP ID</div>
                                                <div className="text-xs font-black text-zinc-900">{crop.farmId}</div>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-zinc-900 mb-6 tracking-tight uppercase">{crop.name}</h3>

                                        <div className="space-y-4 mt-auto">
                                            <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                                                <div>
                                                    <div className="text-[10px] font-black uppercase text-zinc-400">Inventory</div>
                                                    <div className="text-xl font-black text-zinc-900 leading-none mt-1">{crop.quantity} {crop.unit}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black uppercase text-zinc-400">Unit Cost</div>
                                                    <div className="text-xl font-black text-purple-600 leading-none mt-1">₹{crop.price}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => { e.stopPropagation(); deleteCrop(crop._id) }}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white p-3 rounded-2xl shadow-xl shadow-red-500/30 opacity-0 group-hover:opacity-100 transition-all z-20"
                                        >
                                            <Trash2 size={18} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Modal */}
                <AnimatePresence>
                    {showAddCrop && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xl" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-12 rounded-[4rem] max-w-lg w-full m-4 shadow-3xl relative z-110"
                            >
                                <div className="mb-12">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Fingerprint size={12} />
                                        <span>Innovation Ledger</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">New Portfolio Item</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input
                                                placeholder="Product Name"
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 px-5 text-zinc-800 font-bold text-sm"
                                                value={newCrop.name}
                                                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                                            />
                                            <select
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 px-5 outline-none font-bold text-sm"
                                                value={newCrop.category}
                                                onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                                            >
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <input
                                                type="number"
                                                placeholder="Available Units"
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 px-5 font-bold text-sm"
                                                value={newCrop.quantity}
                                                onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Unit Price"
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 px-5 font-bold text-sm"
                                                value={newCrop.price}
                                                onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        className="w-full bg-zinc-900 text-white font-black uppercase py-6 rounded-[1.5rem] flex items-center justify-center gap-4 transition-all hover:bg-purple-600"
                                        disabled={loading}
                                        onClick={async () => {
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

                                                    const res = await axios.post('/api/farmer/add-product', formData)
                                                    setCrops([...crops, res.data.product])
                                                    setShowAddCrop(false)
                                                    toast.success('Innovation Added to Portfolio!')
                                                } catch (error) { toast.error('Logging failed') } finally { setLoading(false) }
                                            }
                                        }}
                                    >
                                        {loading ? <Loader className="animate-spin" /> : (
                                            <><span>Launch Product</span><Rocket className="w-5 h-5 text-purple-400" /></>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                <TutorialGuide steps={STARTUP_TOUR_STEPS} tourName="startup_v1" />
                <div id="tour-voice" className="fixed bottom-10 right-10 w-1 h-1 pointer-events-none" />
            </div>
        </div>
    )
}

export default StartupDashboard

'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
    Loader, TrendingUp, DollarSign, Plus, Sparkles, Sprout, Briefcase,
    Zap, X, MapPin, ArrowRight, ShieldCheck, History, Info,
    Calendar, Fingerprint, Activity, LineChart as ChartIcon, Package, Upload, Trash2, Send, Users, CheckCircle, AlertCircle
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
        name: string, quantity: string, price: string, category: string, unit: string, farmId: string, harvestDate: string, image: File | null, imagePreview: string | null, fssaiLicense: string, originState: string, originCity: string
    }>({
        name: '', quantity: '', price: '', category: 'Raw Millets', unit: 'kg', farmId: 'FARM-' + Math.floor(Math.random() * 9000 + 1000), harvestDate: new Date().toISOString().split('T')[0], image: null, imagePreview: null, fssaiLicense: '', originState: 'Haryana', originCity: ''
    })
    const [crops, setCrops] = useState<Array<any>>([])
    const [selectedScheme, setSelectedScheme] = useState<string | null>(null)
    const [cropImage, setCropImage] = useState<File | null>(null)
    const [cropPreview, setCropPreview] = useState<string | null>(null)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [analyzing, setAnalyzing] = useState(false)

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
        <div className="min-h-screen bg-zinc-50 pb-20 pt-[110px] md:pt-[120px] selection:bg-green-100 selection:text-green-900">
            <Nav user={userData as any} />
            <VoiceAssistant onCommand={handleVoiceCommand} />
            {/* tour-voice target is inside VoiceAssistant component usually, but we can wrap it or add id inside */}
            <div id="tour-voice" className="fixed bottom-10 right-10 w-1 h-1 pointer-events-none" />
            <TutorialGuide steps={FARMER_TOUR_STEPS} tourName="farmer_v1" />
            <div className="w-[95%] md:w-[90%] xl:w-[85%] 2xl:max-w-[1400px] mx-auto space-y-8 md:space-y-12">

                {/* Header Section */}
                <div id="tour-header" className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
                    <div className="space-y-3 md:space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-green-600 font-black uppercase tracking-[0.3em] text-[10px] bg-green-50 w-fit px-3 py-1 rounded-lg border border-green-100"
                        >
                            <Sprout size={14} className="animate-pulse" />
                            <span>Farmer Empowerment Hub</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-[0.9] sm:leading-none'
                        >
                            Grow. <span className="text-zinc-400">Predict.</span> <br />Scale.
                        </motion.h1>
                        <p className="text-zinc-500 max-w-lg font-medium text-base md:text-lg">Manage your produce with AI-driven market intelligence and SIH-standard traceability.</p>
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
                                <div className="text-xl font-black text-zinc-900">98.4%</div>
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
                        id="tour-analytics"
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
                                        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Digital Harvest Guide</h2>
                                        <p className="text-zinc-500 text-sm font-medium italic">Neural prediction model v2.1</p>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        Live Processing
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
                                        placeholder="Volume (kg)"
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
                                        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 bg-zinc-900 rounded-[2.5rem] border border-white/5 shadow-2xl"
                                    >
                                        <div className="space-y-6">
                                            <div className="inline-flex items-center gap-3 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                                <ChartIcon size={12} />
                                                <span>Prediction Outcome</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm text-zinc-400 font-bold uppercase tracking-widest">Expected Rate</div>
                                                <div className="text-6xl font-black text-white tracking-tighter">₹{prediction.estimatedPrice}<span className="text-2xl text-green-400">/kg</span></div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/5 p-4 rounded-2xl flex-1">
                                                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Sentiment</div>
                                                    <div className="text-green-400 font-black uppercase tracking-widest mt-1">Bullish</div>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-2xl flex-1">
                                                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Confidence</div>
                                                    <div className="text-white font-black uppercase tracking-widest mt-1">92%</div>
                                                </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DemandHeatmap />
                    <MarketPricesWidget />
                </div>

                {/* News & Schemes Resource Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px] h-auto">
                    <NewsCard />
                    <SchemesCard />
                </div>

                {/* Crop Quality Analysis */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12 rounded-[3.5rem] border border-blue-100 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">
                            <Sprout size={16} />
                            <span>AI Quality Inspector</span>
                        </div>

                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-2">Crop Quality Analysis</h2>
                            <p className="text-zinc-600 font-medium">Upload a photo to assess health, grade, and market readiness.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Upload Section */}
                            <div className="space-y-4">
                                <label htmlFor="crop-upload" className="cursor-pointer">
                                    <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all text-center min-h-[300px] flex flex-col items-center justify-center">
                                        {cropPreview ? (
                                            <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                                                <img src={cropPreview} alt="Crop" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setCropPreview(null); setCropImage(null); setAnalysisResult(null); }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Upload className="text-blue-600" size={32} />
                                                </div>
                                                <p className="text-zinc-900 font-bold text-lg mb-1">Upload Crop Photo</p>
                                                <p className="text-zinc-400 text-sm">Click to browse or drag and drop</p>
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
                                    <button
                                        onClick={analyzeCrop}
                                        className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Sprout size={20} />
                                        Analyze Quality
                                    </button>
                                )}

                                {analyzing && (
                                    <div className="w-full bg-blue-50 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 text-blue-700 font-bold">
                                        <Loader className="animate-spin" size={20} />
                                        Analyzing...
                                    </div>
                                )}
                            </div>

                            {/* Results Section */}
                            <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-lg">
                                {analysisResult ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                                {analysisResult.health === "Healthy" ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase text-zinc-400 tracking-widest">Crop Type</p>
                                                <p className="text-lg font-black text-zinc-900">{analysisResult.cropType}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-zinc-600">Health Status</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${analysisResult.health === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {analysisResult.health}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-zinc-600">Quality Grade</span>
                                                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700">
                                                    {analysisResult.grade}
                                                </span>
                                            </div>
                                        </div>

                                        {analysisResult.issues && analysisResult.issues.length > 0 && (
                                            <div className="pt-4 border-t border-zinc-100">
                                                <p className="text-xs font-black uppercase text-zinc-400 tracking-widest mb-2">Detected Issues</p>
                                                <ul className="space-y-1">
                                                    {analysisResult.issues.map((issue: string, i: number) => (
                                                        <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                                                            <span className="text-orange-500 mt-1">⚠</span>
                                                            <span>{issue}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Sprout className="text-zinc-300" size={28} />
                                        </div>
                                        <p className="text-zinc-400 font-medium">Analysis results will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <FarmerNegotiations farmerId={userData?._id!} />

                {/* Listings Section */}
                <div className="space-y-10">
                    <div className="flex items-end justify-between">
                        <div className="space-y-3">
                            <h2 className='text-4xl font-black text-zinc-900 tracking-tight'>Digital Harvest Log</h2>
                            <p className="text-zinc-500 font-medium text-lg">Traceable produce active in the global marketplace.</p>
                        </div>
                        <motion.button
                            id="tour-add"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl shadow-green-900/20"
                            onClick={() => setShowAddCrop(true)}
                        >
                            <Plus size={20} />
                            <span>List Harvest</span>
                        </motion.button>
                    </div>

                    {crops.length === 0 ? (
                        <div className="py-32 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-zinc-200 shadow-sm">
                            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <History className="text-zinc-200" size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-zinc-800 mb-2 tracking-tight">Empty Granary</h3>
                            <p className="text-zinc-400 font-medium">Broadcast your produce to secure bulk buyer orders.</p>
                        </div>
                    ) : (
                        <div id="tour-ledger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                                            <span>Harvested: {crop.harvestDate}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-zinc-400">Available</div>
                                                <div className="text-xl font-black text-zinc-900 leading-none mt-1">{crop.quantity} {crop.unit}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase text-zinc-400">Fixed Rate</div>
                                                <div className="text-xl font-black text-green-600 leading-none mt-1">₹{crop.price}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCrop(crop._id)
                                        }}
                                        className="absolute top-4 right-4 bg-white p-2 rounded-full text-red-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm z-10"
                                        title="Remove Listing"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Modal */}
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
                                    <span>SIH #260 Traceability Protocol</span>
                                </div>
                                <h3 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">New Produce Log</h3>
                                <p className="text-zinc-500 font-medium">Register your harvest on the blockchain-ready ledger.</p>
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
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-xs uppercase tracking-widest">Change Image</div>
                                        </label>
                                        <input
                                            type="file"
                                            id="cropImage"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setNewCrop({
                                                        ...newCrop,
                                                        image: file,
                                                        imagePreview: URL.createObjectURL(file)
                                                    })
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <Sprout className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Crop e.g. Foxtail Millet"
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold text-sm"
                                                value={newCrop.name}
                                                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                            <select
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-10 text-zinc-800 outline-none font-bold text-sm appearance-none focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all cursor-pointer"
                                                value={newCrop.category}
                                                onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                                            >
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                        <input
                                            type="number"
                                            placeholder="Volume"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 outline-none font-bold text-sm"
                                            value={newCrop.quantity}
                                            onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-zinc-400 text-xs">₹</div>
                                        <input
                                            type="number"
                                            placeholder="Rate/kg"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 outline-none font-bold text-sm"
                                            value={newCrop.price}
                                            onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                        <input
                                            placeholder="State"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 px-5 text-zinc-800 outline-none font-bold text-sm"
                                            value={newCrop.originState}
                                            onChange={(e) => setNewCrop({ ...newCrop, originState: e.target.value })}
                                        />
                                        <input
                                            placeholder="City/Village"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 px-5 text-zinc-800 outline-none font-bold text-sm"
                                            value={newCrop.originCity}
                                            onChange={(e) => setNewCrop({ ...newCrop, originCity: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group md:col-span-2">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                        <input
                                            placeholder="FSSAI License (Optional for Farmers)"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] py-5 pl-14 pr-5 text-zinc-800 outline-none font-bold text-sm"
                                            value={newCrop.fssaiLicense}
                                            onChange={(e) => setNewCrop({ ...newCrop, fssaiLicense: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <div className="absolute top-4 left-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Farm ID</div>
                                        <input
                                            readOnly
                                            className="w-full bg-zinc-100 border border-zinc-200 rounded-[1.5rem] pt-8 pb-4 px-5 text-zinc-500 font-black text-xs cursor-default"
                                            value={newCrop.farmId}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute top-4 left-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Harvested</div>
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-[1.5rem] pt-8 pb-4 px-5 text-zinc-800 font-bold text-xs outline-none"
                                            value={newCrop.harvestDate}
                                            onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-zinc-900 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[1.5rem] shadow-2xl shadow-zinc-900/30 flex items-center justify-center gap-4 mt-8 transition-all hover:bg-green-600 border border-white/10"
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
                                                formData.append("fssaiLicense", newCrop.fssaiLicense);
                                                formData.append("originState", newCrop.originState);
                                                formData.append("originCity", newCrop.originCity);
                                                if (newCrop.image) {
                                                    formData.append("image", newCrop.image);
                                                }

                                                const res = await axios.post('/api/farmer/add-product', formData)
                                                setCrops([...crops, res.data.product])
                                                setShowAddCrop(false)
                                                setNewCrop({
                                                    ...newCrop, name: '', quantity: '', price: '', image: null, imagePreview: null,
                                                    farmId: 'FARM-' + Math.floor(Math.random() * 9000 + 1000)
                                                })
                                                toast.success('Blockchain Logged & Marketplace Updated!')
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
        </div>
    )
}

export default FarmerDashboard




'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import {
    Loader, ScanEye, Upload, ShoppingBag, Sparkles,
    ShieldCheck, Zap, Info, ArrowRight, MessageSquare,
    Search, Filter, MapPin, Tag
} from 'lucide-react'
import toast from 'react-hot-toast'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import NegotiationChat from '@/components/NegotiationChat'
import CertificateModal from '@/components/CertificateModal'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import TutorialGuide from '@/components/TutorialGuide'

const BUYER_TOUR_STEPS = [
    {
        targetId: 'buyer-header',
        title: 'Procurement Command',
        content: 'Welcome to the Corporate Buyer Interface. Sourcing bulk millets and verified produce starts here.'
    },
    {
        targetId: 'buyer-feed',
        title: 'Live Harvest Feed',
        content: 'View real-time listings from SHGs and Farmers. Filter by crop type, volume, and certifications to find your exact match.'
    },
    {
        targetId: 'buyer-ai',
        title: 'AI Quality Check',
        content: 'Upload sample images to get instant quality grading and moisture analysis before you even place an order.'
    },
    {
        targetId: 'buyer-market',
        title: 'Price Intelligence',
        content: 'Stay ahead with real-time MSP tracking and demand heatmaps to optimize your procurement strategy.'
    }
]

import { useRouter } from 'next/navigation'

function BuyerMarketplace() {
    const { userData } = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [showNegotiation, setShowNegotiation] = useState(false)
    const [showCertificate, setShowCertificate] = useState(false)
    const [stats, setStats] = useState({ activeSellers: 0, bulkVolume: 0, formattedVolume: '0 kg' })

    const [analysis, setAnalysis] = useState<any>(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const fetchData = async () => {
        setLoadingProducts(true)
        try {
            const [prodRes, statsRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/analytics/platform-stats')
            ])
            setProducts(prodRes.data)
            setStats(statsRes.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load marketplace listings")
        } finally {
            setLoadingProducts(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64String = reader.result as string
            setImagePreview(base64String)
            setAnalyzing(true)
            try {
                const res = await axios.post('/api/ai/crop-analysis', { image: base64String })
                setAnalysis(res.data)
                toast.success("AI Analysis Complete!")
            } catch (error) {
                console.error(error)
                toast.error("Analysis failed. Try again.")
            } finally {
                setAnalyzing(false)
            }
        }
        reader.readAsDataURL(file)
    }

    const openNegotiation = (product: any) => {
        if (!userData) {
            toast.error("Please login to initiate negotiation")
            return
        }
        if (!product.owner) {
            toast.error("Farmer contact info unavailable for this listing")
            return
        }
        setSelectedProduct(product)
        setShowNegotiation(true)
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <Nav user={userData as any} />
            <TutorialGuide steps={BUYER_TOUR_STEPS} tourName="buyer_v1" />

            <div className="pb-20 pt-[140px] w-[95%] md:w-[90%] mx-auto space-y-12">

                {/* Header & Stats */}
                <div id="buyer-header" className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-8 bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-zinc-900/5 border border-zinc-100">
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
                            <ShoppingBag size={16} />
                            <span>Verified Supply Chain</span>
                        </div>
                        <h1 className='text-3xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-none'>Buyer Marketplace</h1>
                        <p className="text-zinc-500 max-w-lg font-medium text-base md:text-lg italic">"Direct procurement engine for corporate buyers and food processors."</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="bg-zinc-50 px-6 md:px-8 py-4 md:py-6 rounded-3xl border border-zinc-100 flex-1 sm:min-w-[160px]">
                            <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Active Sellers</div>
                            <div className="text-xl md:text-2xl font-black text-zinc-900">{stats.activeSellers > 0 ? `${stats.activeSellers}+` : "124+"}</div>
                        </div>
                        <div className="bg-blue-600 px-6 md:px-8 py-4 md:py-6 rounded-3xl shadow-lg shadow-blue-600/20 text-white flex-1 sm:min-w-[160px]">
                            <div className="text-[10px] font-black uppercase text-white/60 tracking-widest mb-1">Bulk Volume</div>
                            <div className="text-xl md:text-2xl font-black">{stats.bulkVolume > 0 ? stats.formattedVolume : "2.4k Tons"}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Product Feed */}
                    <div id="buyer-feed" className="lg:col-span-8 space-y-6 md:space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-xl md:text-2xl font-black text-zinc-900 flex items-center gap-2">
                                Current Opportunities
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </h2>
                            <div className="flex items-center gap-3 md:gap-4">
                                <button className="p-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 shadow-sm">
                                    <Filter size={20} className="text-zinc-600" />
                                </button>
                                <div className="relative flex-1 md:flex-initial">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        placeholder="Search harvest type..."
                                        className="w-full md:w-64 bg-white border border-zinc-200 pl-12 pr-6 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-sm shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {loadingProducts ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-[300px] bg-white rounded-[2.5rem] animate-pulse border border-zinc-100" />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-zinc-200">
                                <ShoppingBag className="mx-auto text-zinc-200 mb-6" size={64} />
                                <h3 className="text-2xl font-black text-zinc-800">No active listings</h3>
                                <p className="text-zinc-500">Wait for farmers to list their next harvest or refresh the feed.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group bg-white rounded-[3rem] overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-900/5 hover:shadow-2xl transition-all"
                                    >
                                        <div className="relative h-56 w-full bg-zinc-50 p-8">
                                            <Image
                                                src={product.image || 'https://via.placeholder.com/300'}
                                                fill
                                                className="object-contain p-4 transition-transform group-hover:scale-105"
                                                alt={product.name}
                                            />
                                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                                <span className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 border border-zinc-100">
                                                    {product.category}
                                                </span>
                                                {product.owner?.role === 'shg' && (
                                                    <span className="bg-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20">
                                                        SHG Certified
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-2xl font-black text-zinc-900 truncate">{product.name}</h3>
                                                    <div className="text-blue-600 font-black text-xl">₹{product.price} <span className="text-[10px] text-zinc-400">/{product.unit}</span></div>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} /> {product.location?.city || 'Vidarbha'}
                                                    </div>
                                                    <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                                                    <div className="flex items-center gap-1">
                                                        <Tag size={12} /> Stock: {product.stock || '120'}kg
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => window.location.href = `/product/${product._id}`}
                                                    className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => openNegotiation(product)}
                                                    className="w-14 h-14 flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-600/5 group/btn"
                                                    title="Initiate Negotiation"
                                                >
                                                    <MessageSquare size={20} className="group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* AI & Marketplace Intelligence Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Quality Analysis Card */}
                        <motion.div
                            id="buyer-ai"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-zinc-900 p-8 md:p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none"></div>

                            <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                                <ScanEye size={16} />
                                <span>AI Quality Assurance</span>
                            </div>

                            <h2 className="text-3xl font-black mb-10 leading-none tracking-tight text-white/90">Instant Crop <br />Intelligence</h2>

                            <label className="block w-full border-2 border-dashed border-white/10 hover:border-blue-500 rounded-[2.5rem] p-12 text-center cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden bg-white/5">
                                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />

                                <div className="space-y-4 relative z-10 transition-transform group-hover:scale-105">
                                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors shadow-inner">
                                        <Upload className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-lg">Upload Sample</p>
                                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">Image Analysis (Max 10MB)</p>
                                    </div>
                                </div>

                                {imagePreview && (
                                    <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20">
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="sample" />
                                    </div>
                                )}
                            </label>

                            <AnimatePresence mode="wait">
                                {analyzing && (
                                    <motion.div
                                        key="loader"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-8 flex flex-col items-center gap-4 py-12 bg-white/5 rounded-[2.5rem] border border-white/5"
                                    >
                                        <Loader className="animate-spin text-blue-400" size={32} />
                                        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest text-center">Identifying protein signatures <br /> & moisture levels...</p>
                                    </motion.div>
                                )}

                                {analysis && !analyzing && (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-8 space-y-6"
                                    >
                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Identified Crop</div>
                                                <div className="text-xl font-bold">{analysis.cropType}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Health Metric</div>
                                                <div className={`text-xl font-bold ${analysis.health === 'Healthy' ? 'text-green-400' : 'text-amber-400'}`}>{analysis.health}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Grade</div>
                                                <div className="text-4xl font-black text-blue-400">{analysis.grade}</div>
                                            </div>
                                            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center">
                                                <ShieldCheck className="text-green-400 mb-1" size={32} />
                                                <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Trust Pass</span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-3">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                                <Info size={14} />
                                                <span>Analysis Notes</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 font-medium leading-relaxed italic">
                                                {analysis.issues?.length > 0 ? `Detected anomalies: ${analysis.issues.join(', ')}.` : "Sample matches elite export standards. No visible contaminants or decay detected."}
                                            </p>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowCertificate(true)}
                                            className="w-full py-5 bg-blue-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20"
                                        >
                                            <span>Generate Certificate</span>
                                            <Sparkles size={16} />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <div id="buyer-market" className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-xl shadow-zinc-900/5 space-y-8">
                            <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Market Intelligence</h3>
                            <div className="space-y-4">
                                <div
                                    onClick={() => router.push('/tools/ai-insights')}
                                    className="p-6 bg-zinc-50 rounded-3xl group hover:bg-zinc-100 transition-colors cursor-pointer border border-zinc-100"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-zinc-900 font-black">₹</div>
                                            <span className="text-sm font-black text-zinc-800 uppercase tracking-tight">MSP Tracker</span>
                                        </div>
                                        <ArrowRight size={18} className="text-zinc-300 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-medium ml-15 italic">"Ragi pricing up 12% in Mandya hub this week."</p>
                                </div>

                                <div
                                    onClick={() => router.push('/tools/ai-insights')}
                                    className="p-6 bg-zinc-50 rounded-3xl group hover:bg-zinc-100 transition-colors cursor-pointer border border-zinc-100"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-zinc-900 font-black">📈</div>
                                            <span className="text-sm font-black text-zinc-800 uppercase tracking-tight">Demand Heatmap</span>
                                        </div>
                                        <ArrowRight size={18} className="text-zinc-300 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-medium ml-15 italic">"High processing demand in Pune/Hyderabad for Foxtail."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <AnimatePresence>
                {showNegotiation && selectedProduct && userData && (
                    <NegotiationChat
                        productId={selectedProduct._id}
                        buyerId={userData._id!}
                        farmerId={selectedProduct.owner._id || selectedProduct.owner}
                        farmerName={selectedProduct.owner.name || "Farmer"}
                        buyerName={userData.name}
                        currentUserRole="buyer"
                        onClose={() => setShowNegotiation(false)}
                    />
                )}
                {showCertificate && analysis && (
                    <CertificateModal
                        analysis={analysis}
                        buyerName={userData?.name || "Verified Buyer"}
                        onClose={() => setShowCertificate(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default BuyerMarketplace

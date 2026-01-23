'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { Loader, ScanEye, Upload, ShoppingBag, Sparkles, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

function BuyerMarketplace() {
    const [analysis, setAnalysis] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64String = reader.result as string
            setImagePreview(base64String)
            setLoading(true)
            try {
                const res = await axios.post('/api/ai/crop-analysis', { image: base64String })
                setAnalysis(res.data)
                toast.success("AI Analysis Complete!")
            } catch (error) {
                console.error(error)
                toast.error("Analysis failed. Try again.")
            } finally {
                setLoading(false)
            }
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 pt-[120px]">
            <div className="w-[95%] md:w-[85%] mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-[0.2em] text-xs">
                            <ShoppingBag size={16} />
                            <span>Premium Procurement</span>
                        </div>
                        <h1 className='text-4xl md:text-5xl font-black text-zinc-900 tracking-tight'>Buyer Marketplace</h1>
                        <p className="text-zinc-500 max-w-lg font-medium">Source high-quality millets directly from verified farmers across Bharat.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Main Feed Placeholder */}
                    <div className="lg:col-span-3 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-zinc-100 min-h-[500px] flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-300">
                                <Zap size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Active Listings Queue</h2>
                                <p className="text-zinc-500 font-medium max-w-xs mx-auto">The decentralized marketplace is currently syncing with regional hubs.</p>
                            </div>
                            <button className="bg-zinc-100 text-zinc-400 px-8 py-3 rounded-2xl font-bold cursor-not-allowed">
                                Refresh Feed
                            </button>
                        </motion.div>
                    </div>

                    {/* AI Scanner Sidebar */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-zinc-900 p-8 md:p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>

                            <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                                <ScanEye size={16} />
                                <span>AI Quality Assurance</span>
                            </div>

                            <h2 className="text-2xl font-black mb-8 leading-tight">Instant Crop Intelligence</h2>

                            <label className="block w-full border-2 border-dashed border-white/20 hover:border-blue-400 rounded-[2rem] p-10 text-center cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden">
                                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />

                                <div className="space-y-4 relative z-10 transition-transform group-hover:scale-105">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Upload Crop Sample</p>
                                        <p className="text-zinc-500 text-xs">JPEG, PNG up to 10MB</p>
                                    </div>
                                </div>

                                {imagePreview && (
                                    <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40">
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="sample" />
                                    </div>
                                )}
                            </label>

                            <AnimatePresence>
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-8 flex flex-col items-center gap-4 py-8 bg-white/5 rounded-[2rem] border border-white/5"
                                    >
                                        <Loader className="animate-spin text-blue-400" size={32} />
                                        <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">Neural Analysis in Progress...</p>
                                    </motion.div>
                                )}

                                {analysis && !loading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-8 space-y-6"
                                    >
                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Identified Crop</div>
                                                <div className="text-lg font-bold">{analysis.cropType}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Health Metric</div>
                                                <div className={`text-lg font-bold ${analysis.health === 'Healthy' ? 'text-green-400' : 'text-amber-400'}`}>{analysis.health}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Grade</div>
                                                <div className="text-xl font-black text-blue-400">{analysis.grade}</div>
                                            </div>
                                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                                                <ShieldCheck className="text-green-400" size={32} />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                                <Info size={14} />
                                                <span>Analysis Notes</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                                                {analysis.issues?.length > 0 ? `Detected anomalies: ${analysis.issues.join(', ')}.` : "Sample matches elite export standards. No visible contaminants or decay detected."}
                                            </p>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                                        >
                                            <span>Generate Certificate</span>
                                            <Sparkles size={16} />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-xl shadow-zinc-900/5 space-y-6">
                            <h3 className="text-xl font-black text-zinc-900 tracking-tight">Market Insights</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl group cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-zinc-400 font-bold">W</div>
                                        <span className="text-sm font-bold text-zinc-700">Weekly Trade Vol</span>
                                    </div>
                                    <ArrowRight size={16} className="text-zinc-300" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl group cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-zinc-400 font-bold">P</div>
                                        <span className="text-sm font-bold text-zinc-700">Price Dynamics</span>
                                    </div>
                                    <ArrowRight size={16} className="text-zinc-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerMarketplace


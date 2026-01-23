'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import {
    Loader, TrendingUp, DollarSign, Plus, Sparkles, Sprout, Briefcase,
    Zap, X, MapPin, ArrowRight, ShieldCheck, History, Info,
    Calendar, Fingerprint, Activity, LineChart as ChartIcon, Package
} from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts'
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

function FarmerDashboard() {
    const [region, setRegion] = useState('')
    const [quantity, setQuantity] = useState('')
    const [crop, setCrop] = useState('')
    const [prediction, setPrediction] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [showAddCrop, setShowAddCrop] = useState(false)
    const [newCrop, setNewCrop] = useState({
        name: '', quantity: '', price: '', category: 'Raw Millets', unit: 'kg', farmId: 'FARM-' + Math.floor(Math.random() * 9000 + 1000), harvestDate: new Date().toISOString().split('T')[0]
    })
    const [crops, setCrops] = useState<Array<any>>([])

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

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 pt-[120px] selection:bg-green-100 selection:text-green-900">
            <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
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
                            className='text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-none'
                        >
                            Grow. <span className="text-zinc-400">Predict.</span> <br />Scale.
                        </motion.h1>
                        <p className="text-zinc-500 max-w-lg font-medium text-lg">Manage your produce with AI-driven market intelligence and SIH-standard traceability.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-green-900/5 border border-zinc-100 flex items-center gap-4">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AI Price Predictor Card */}
                    <motion.div
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
                                        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Market Analytics</h2>
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
                                            <ResponsiveContainer width="100%" height="100%">
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

                    {/* Quick Stats / Schemes Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-green-600 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-green-900/40 flex flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

                        <div className="relative">
                            <div className="flex items-center gap-3 text-white/70 font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                                <Briefcase size={16} />
                                <span>Policy Watch</span>
                            </div>
                            <h3 className="text-4xl font-black mb-10 leading-[0.9] tracking-tighter">Support <br />Programs</h3>

                            <div className="space-y-4">
                                <div className="p-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-[2rem] transition-all cursor-pointer group backdrop-blur-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black tracking-tight text-lg">PM POSHAN</h4>
                                        <ArrowRight size={18} className="transition-all group-hover:translate-x-2" />
                                    </div>
                                    <p className="text-xs text-white/70 font-medium leading-relaxed">Direct supply chain for mid-day meal programs with 15% price premium.</p>
                                </div>
                                <div className="p-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-[2rem] transition-all cursor-pointer group backdrop-blur-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black tracking-tight text-lg">PLI Millet Hub</h4>
                                        <ArrowRight size={18} className="transition-all group-hover:translate-x-2" />
                                    </div>
                                    <p className="text-xs text-white/70 font-medium leading-relaxed">Processing units for value-added products with 40% subsidy.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between relative">
                            <div>
                                <div className="text-[10px] font-black uppercase text-white/60 tracking-widest">Network</div>
                                <div className="text-2xl font-black text-white">12.4k+</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase text-white/60 tracking-widest">Market Cap</div>
                                <div className="text-2xl font-black text-white">₹4.2 Cr</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Listings Section */}
                <div className="space-y-10">
                    <div className="flex items-end justify-between">
                        <div className="space-y-3">
                            <h2 className='text-4xl font-black text-zinc-900 tracking-tight'>Digital Harvest Log</h2>
                            <p className="text-zinc-500 font-medium text-lg">Traceable produce active in the global marketplace.</p>
                        </div>
                        <motion.button
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
                                        <div className="w-16 h-16 bg-green-50 rounded-[1.5rem] flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                            <Sprout size={32} />
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

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ShieldCheck className="text-green-500" size={24} />
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
                                                await axios.post('/api/farmer/add-product', newCrop)
                                                setCrops([...crops, newCrop])
                                                setShowAddCrop(false)
                                                setNewCrop({
                                                    ...newCrop, name: '', quantity: '', price: '',
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
        </div>
    )
}

function Send(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    )
}

export default FarmerDashboard



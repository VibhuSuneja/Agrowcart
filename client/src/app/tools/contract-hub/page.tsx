'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
    Gavel, ShieldCheck, Sparkles, Loader, ArrowRight,
    Briefcase, Building2, UserCheck, Scale, History,
    FileText, Zap, ChevronRight
} from 'lucide-react'
import Nav from '@/components/Nav'
import ContractViewer from '@/components/ContractViewer'
import toast from 'react-hot-toast'

const SCHEMES = [
    {
        id: 'PM_POSHAN',
        name: 'PM POSHAN (MDM)',
        agency: 'Ministry of Education',
        desc: 'Direct sourcing for National Nutritional Program.',
        color: 'from-blue-500 to-indigo-600'
    },
    {
        id: 'PDS_RATIONS',
        name: 'Public Distribution (PDS)',
        agency: 'Department of Food & Distribution',
        desc: 'Guaranteed buy-back for state ration distribution.',
        color: 'from-emerald-500 to-teal-600'
    },
    {
        id: 'MOD_CANTEENS',
        name: 'Ministry of Defence Canteens',
        agency: 'Armed Forces Procurement',
        desc: 'Supplying nutrient-dense millets to defense personnel.',
        color: 'from-amber-600 to-orange-700'
    },
    {
        id: 'INST_HOSPITALS',
        name: 'Institutional Medical Sourcing',
        agency: 'Public Health Department',
        desc: 'High-quality sourcing for government hospitals.',
        color: 'from-purple-600 to-pink-600'
    }
]

export default function ContractHubPage() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [selectedScheme, setSelectedScheme] = useState<any>(null)
    const [crops, setCrops] = useState<any[]>([])
    const [selectedCrop, setSelectedCrop] = useState<any>(null)
    const [loadingCrops, setLoadingCrops] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [contractData, setContractData] = useState<any>(null)

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const res = await axios.get('/api/farmer/get-products')
                setCrops(res.data)
            } catch (error) {
                console.error("Failed to fetch products", error)
            } finally {
                setLoadingCrops(false)
            }
        }
        fetchCrops()
    }, [])

    const handleGenerate = async () => {
        if (!selectedScheme || !selectedCrop || !userData) {
            toast.error("Please select a scheme and a harvest listing.")
            return
        }

        setGenerating(true)
        try {
            const res = await axios.post('/api/ai/generate-contract', {
                scheme: selectedScheme.name,
                farmerData: {
                    name: userData.name,
                    location: `${userData.city || 'Regional Hub'}, ${userData.state || 'Registered State'}`,
                    role: userData.role
                },
                produceDetails: {
                    name: selectedCrop.name,
                    quantity: selectedCrop.stock,
                    unit: selectedCrop.unit,
                    price: selectedCrop.price
                }
            })
            setContractData(res.data)
            toast.success("Draft Agreement Generated Successfully")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to generate agreement")
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-background-dark pb-32 pt-[110px] md:pt-[140px]">
            <Nav user={userData as any} />

            <div className="w-[95%] lg:w-[85%] max-w-7xl mx-auto">
                <header className="mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-indigo-500 font-black uppercase tracking-[0.4em] text-[10px] bg-indigo-500/10 w-fit px-4 py-1.5 rounded-full border border-indigo-500/20"
                    >
                        <Scale size={14} />
                        <span>Legal Tech Module</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                        Institutional <br />Contract <span className="text-zinc-300 dark:text-zinc-700">Hub</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl font-medium text-lg">
                        Bridge the gap between raw production and institutional demand. Generate AI-powered, legally sound draft agreements for government mandates.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Selection */}
                    <div className="lg:col-span-12 space-y-12">

                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center font-black">1</div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Select Procurement Scheme</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {SCHEMES.map((scheme) => (
                                    <motion.div
                                        key={scheme.id}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedScheme(scheme)}
                                        className={`p-6 rounded-[2.5rem] cursor-pointer transition-all border-2 relative overflow-hidden group ${selectedScheme?.id === scheme.id
                                            ? 'bg-slate-950 border-indigo-500 shadow-2xl'
                                            : 'bg-white dark:bg-white/5 border-zinc-100 dark:border-white/5 bg-zinc-50/50'
                                            }`}
                                    >
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${scheme.color} opacity-10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />

                                        <div className="relative z-10 space-y-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedScheme?.id === scheme.id ? 'bg-indigo-500 text-white' : 'bg-zinc-100 dark:bg-white/10 text-zinc-400'
                                                }`}>
                                                <Briefcase size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">{scheme.agency}</p>
                                                <h3 className={`font-black text-lg tracking-tight ${selectedScheme?.id === scheme.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                    {scheme.name}
                                                </h3>
                                            </div>
                                            <p className={`text-xs font-medium leading-relaxed ${selectedScheme?.id === scheme.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                                {scheme.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center font-black">2</div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Assign Harvest Listing</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {loadingCrops ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <div key={i} className="h-40 bg-zinc-100 dark:bg-white/5 animate-pulse rounded-[2.5rem]" />
                                    ))
                                ) : crops.length === 0 ? (
                                    <div className="col-span-full py-12 text-center bg-zinc-50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-white/10">
                                        <History size={40} className="mx-auto text-zinc-300 mb-4" />
                                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No active harvest listings found</p>
                                    </div>
                                ) : (
                                    crops.map((crop) => (
                                        <motion.div
                                            key={crop._id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setSelectedCrop(crop)}
                                            className={`p-6 rounded-[2.5rem] cursor-pointer transition-all border-2 flex items-center gap-4 ${selectedCrop?._id === crop._id
                                                ? 'bg-slate-950 border-indigo-500 shadow-2xl'
                                                : 'bg-white dark:bg-white/5 border-zinc-100 dark:border-white/5'
                                                }`}
                                        >
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                                {crop.image ? (
                                                    <img src={crop.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-300"><FileText /></div>
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className={`font-black tracking-tight truncate ${selectedCrop?._id === crop._id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                                    {crop.name}
                                                </h4>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                    {crop.stock} {crop.unit} • ₹{crop.price}/{crop.unit}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="pt-10 flex flex-col items-center justify-center space-y-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={generating || !selectedCrop || !selectedScheme}
                                onClick={handleGenerate}
                                className="bg-slate-900 dark:bg-indigo-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm flex items-center gap-4 shadow-3xl disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed group"
                            >
                                {generating ? <Loader className="animate-spin" /> : <Gavel size={20} className="group-hover:rotate-12 transition-transform" />}
                                <span>{generating ? 'Negotiating Clauses...' : 'Generate Legal Agreement'}</span>
                                <Zap size={18} className="fill-white" />
                            </motion.button>
                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] max-w-md text-center">
                                *AI utilizes standard state procurement templates and current market MSP data for draft generation.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Footer Section: Why B2B? */}
                <div className="mt-32 grid md:grid-cols-3 gap-12">
                    {[
                        { icon: Building2, title: "Govt Direct", desc: "Built using official templates for PM-POSHAN and PDS procurement cycles." },
                        { icon: UserCheck, title: "Stakeholder Trust", desc: "Verified digital identities reduce legal friction for smallholder farmers." },
                        { icon: Sparkles, title: "Plain Language", desc: "Complex legal jargon translated into actionable insights for rural understanding." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="w-12 h-12 bg-zinc-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-zinc-400">
                                <item.icon size={24} />
                            </div>
                            <h3 className="font-black text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {contractData && (
                    <ContractViewer
                        data={contractData}
                        onClose={() => setContractData(null)}
                    />
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    )
}

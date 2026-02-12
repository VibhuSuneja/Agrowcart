'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { addToCart } from '@/redux/cartSlice'
import {
    Heart, Apple, Zap, Scale, Target, Activity,
    ShoppingCart, Download, ChevronRight, ArrowLeft,
    Sparkles, Loader, CheckCircle2, ShoppingBag, PieChart
} from 'lucide-react'
import Nav from '@/components/Nav'
import toast from 'react-hot-toast'
import Link from 'next/link'

const GOALS = [
    { id: 'WEIGHT_LOSS', title: 'Weight Loss', icon: Scale, desc: 'High fiber, low GI millets like Barnyard and Kodo.', color: 'from-blue-500 to-cyan-500' },
    { id: 'DIABETES', title: 'Diabetes Care', icon: Activity, desc: 'Slow-release carbs using Jowar and Foxtail.', color: 'from-emerald-500 to-teal-500' },
    { id: 'GROWTH', title: 'Child Growth', icon: Target, desc: 'Calcium-rich Ragi and protein-packed Proso.', color: 'from-amber-500 to-orange-500' },
    { id: 'FITNESS', title: 'Athletic Peak', icon: Zap, desc: 'Iron-rich Bajra and energy-dense Little millet.', color: 'from-purple-500 to-pink-500' }
]

export default function NutritionistPage() {
    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const [step, setStep] = useState(1)
    const [selectedGoal, setSelectedGoal] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [planData, setPlanData] = useState<any>(null)
    const [activeDay, setActiveDay] = useState(1)
    const [availableProducts, setAvailableProducts] = useState<any[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products')
                setAvailableProducts(res.data)
            } catch (error) {
                console.error("Failed to fetch products", error)
            }
        }
        fetchProducts()
    }, [])

    const handleGenerate = async () => {
        if (!selectedGoal) return
        setLoading(true)
        try {
            const res = await axios.post('/api/ai/nutritionist', { goal: selectedGoal.title })
            setPlanData(res.data)
            setStep(3)
        } catch (error) {
            toast.error("AI Consultant is currently busy. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const matchProduct = (milletName: string) => {
        const lowerName = milletName.toLowerCase()
        return availableProducts.find(p =>
            p.name.toLowerCase().includes(lowerName) ||
            lowerName.includes(p.name.toLowerCase())
        )
    }

    const addAllToCart = () => {
        let addedCount = 0
        planData.shoppingList.forEach((item: any) => {
            const product = matchProduct(item.item)
            if (product) {
                dispatch(addToCart({ ...product, quantity: 1 }))
                addedCount++
            }
        })
        if (addedCount > 0) {
            toast.success(`Successfully added ${addedCount} millet varieties to your cart!`)
        } else {
            toast.error("Couldn't find direct matches for some harvests. Browse the marketplace manually!")
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-background-dark pb-32 pt-[110px] md:pt-[140px]">
            <Nav user={userData as any} />

            <div className="w-[95%] lg:w-[85%] max-w-7xl mx-auto">
                {/* Visual Background Elements */}
                <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] bg-emerald-500/10 w-fit px-4 py-1.5 rounded-full border border-emerald-500/20"
                                >
                                    <Apple size={14} />
                                    <span>Personalized Wellness</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                    Your Millet <br /><span className="text-emerald-500">Nutritionist.</span>
                                </h1>
                                <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl font-medium text-lg">
                                    Transform your health with biological-specific millet meal plans. AI-powered diagnostics for the modern smart-eater.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {GOALS.map((goal) => (
                                    <motion.div
                                        key={goal.id}
                                        whileHover={{ y: -8 }}
                                        onClick={() => {
                                            setSelectedGoal(goal)
                                            setStep(2)
                                        }}
                                        className="group relative bg-white dark:bg-zinc-900/50 p-8 rounded-[3rem] border border-zinc-100 dark:border-white/5 cursor-pointer hover:border-emerald-500/30 transition-all shadow-xl hover:shadow-2xl overflow-hidden"
                                    >
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${goal.color} opacity-5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />

                                        <div className="relative space-y-6">
                                            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg">
                                                <goal.icon size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">{goal.title}</h3>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed">
                                                    {goal.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="max-w-xl mx-auto py-20 text-center space-y-12"
                        >
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full" />
                                <div className="relative w-32 h-32 bg-white dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-zinc-100 dark:border-white/10 shadow-3xl mx-auto">
                                    {selectedGoal && <selectedGoal.icon size={48} className="text-emerald-500" />}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Begin Health Calibration?</h2>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                                    Our AI will generate a strict 7-day 'Shree Anna' protocol specifically designed for <span className="text-emerald-500 font-bold">{selectedGoal?.title}</span>.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 shadow-3xl"
                                >
                                    {loading ? <Loader className="animate-spin" /> : <Sparkles size={20} />}
                                    <span>{loading ? 'Synthesizing Plan...' : 'Generate 7-Day Plan'}</span>
                                </motion.button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:text-emerald-500 transition-colors"
                                >
                                    Cancel and Change Goal
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && planData && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-12"
                        >
                            {/* Dashboard Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px]">
                                        <Target size={14} />
                                        <span>Target: {selectedGoal?.title}</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Your Neural <span className="text-emerald-500">Diet Chart</span></h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={addAllToCart}
                                        className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl hover:shadow-emerald-500/20 transition-all"
                                    >
                                        <ShoppingCart size={16} />
                                        <span>Add Full Plan to Cart</span>
                                    </motion.button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="p-4 bg-zinc-100 dark:bg-white/5 text-zinc-400 rounded-2xl hover:text-slate-900 dark:hover:text-white transition-all"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Left: Day Selector */}
                                <div className="lg:col-span-3 space-y-4">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 px-4">Cycle Progress</div>
                                    {planData.plan.map((day: any) => (
                                        <motion.div
                                            key={day.day}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setActiveDay(day.day)}
                                            className={`p-6 rounded-3xl cursor-pointer border transition-all flex items-center justify-between group ${activeDay === day.day
                                                    ? 'bg-slate-950 border-emerald-500 text-white shadow-2xl'
                                                    : 'bg-white dark:bg-white/5 border-zinc-100 dark:border-white/5 text-zinc-500 hover:border-emerald-500/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${activeDay === day.day ? 'bg-emerald-500' : 'bg-zinc-100 dark:bg-white/10'}`}>
                                                    0{day.day}
                                                </div>
                                                <span className="font-black tracking-tight uppercase">Phase Day</span>
                                            </div>
                                            {activeDay === day.day && <ChevronRight size={16} className="text-emerald-500" />}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Center: Meal Detail (The Ultra Glass Card) */}
                                <div className="lg:col-span-6">
                                    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 rounded-[4rem] p-10 md:p-14 shadow-3xl relative overflow-hidden">
                                        {/* Ultra Glass Pattern */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                                        <div className="relative space-y-12">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Day {activeDay} Schedule</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Optimum Nutrition</span>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                {Object.entries(planData.plan.find((d: any) => d.day === activeDay).meals).map(([mealName, details]: any) => (
                                                    <motion.div
                                                        key={mealName}
                                                        layoutId={`meal-${mealName}`}
                                                        className="group p-8 bg-zinc-50/50 dark:bg-white/5 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 hover:bg-white dark:hover:bg-zinc-800 transition-all hover:shadow-xl hover:border-emerald-500/20"
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                                                                    <Apple size={20} />
                                                                </div>
                                                                <h4 className="font-black text-lg text-slate-900 dark:text-white capitalize">{mealName}</h4>
                                                            </div>
                                                            <div className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                                                                {details.ingredient}
                                                            </div>
                                                        </div>
                                                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-3 tracking-tight">
                                                            {details.dish}
                                                        </p>
                                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                                                            {details.benefits}
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Shopping List & Quick Buy */}
                                <div className="lg:col-span-3 space-y-8">
                                    <div className="bg-slate-950 rounded-[3rem] p-8 text-white shadow-3xl space-y-8 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                                <ShoppingBag size={20} />
                                            </div>
                                            <h3 className="font-black text-xl tracking-tight">Required Stash</h3>
                                        </div>

                                        <div className="space-y-6">
                                            {planData.shoppingList.map((item: any, i: number) => {
                                                const product = matchProduct(item.item)
                                                return (
                                                    <div key={i} className="flex items-center justify-between group">
                                                        <div>
                                                            <p className="font-black text-sm tracking-tight">{item.item}</p>
                                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.quantity}</p>
                                                        </div>
                                                        {product ? (
                                                            <button
                                                                onClick={() => {
                                                                    dispatch(addToCart({ ...product, quantity: 1 }))
                                                                    toast.success(`Added ${product.name} to cart`)
                                                                }}
                                                                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 transition-all flex items-center justify-center"
                                                            >
                                                                <PlusIcon size={16} />
                                                            </button>
                                                        ) : (
                                                            <Link href="/marketplace">
                                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600">
                                                                    <ChevronRight size={16} />
                                                                </div>
                                                            </Link>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="pt-6 border-t border-white/10">
                                            <div className="bg-white/5 p-5 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <PieChart size={14} className="text-emerald-500" />
                                                    <span className="text-[10px] font-black uppercase text-zinc-400">Nutritional Logic</span>
                                                </div>
                                                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">
                                                    {planData.summary}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
                                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <h4 className="font-black text-slate-900 dark:text-white tracking-tight text-lg">Bio-Verified</h4>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                                            This plan is optimized for low-glycemic index and high nutrient density.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function PlusIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}

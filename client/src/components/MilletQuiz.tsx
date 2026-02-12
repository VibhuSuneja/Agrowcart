'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, ArrowRight, RefreshCw, Zap, Flame, Wind, Mountain, Sun as SunIcon, Loader, Heart, Star } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const QUESTIONS = [
    {
        question: "My energy levels are...",
        options: [
            { label: "A steady marathon runner", value: "steady", icon: Mountain },
            { label: "A sudden lightning bolt", value: "burst", icon: Zap }
        ]
    },
    {
        question: "My current environment feels like...",
        options: [
            { label: "A high-pressure furnace (Busy/Hot)", value: "intense", icon: Flame },
            { label: "A controlled lab (Planned/Efficient)", value: "balanced", icon: Wind }
        ]
    },
    {
        question: "My top wellness priority is...",
        options: [
            { label: "Building a fortress (Strength/Bones)", value: "strength", icon: Mountain },
            { label: "Clearing the fog (Focus/Detox)", value: "clarity", icon: Sparkles }
        ]
    },
    {
        question: "When things get tough, I am...",
        options: [
            { label: "The Oak (I stand my ground)", value: "resilient", icon: Mountain },
            { label: "The Willow (I adapt and flow)", value: "adaptive", icon: Wind }
        ]
    },
    {
        question: "My ideal palate profile is...",
        options: [
            { label: "Rich, nutty, and bold", value: "bold", icon: SunIcon },
            { label: "Smooth, mild, and light", value: "mild", icon: Sparkles }
        ]
    }
]

export default function MilletQuiz() {
    const [started, setStarted] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleAnswer = (value: string) => {
        const newAnswers = [...answers, value]
        setAnswers(newAnswers)

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            getSoulMillet(newAnswers)
        }
    }

    const getSoulMillet = async (finalAnswers: string[]) => {
        setLoading(true)
        try {
            const res = await axios.post('/api/ai/millet-match', { answers: finalAnswers })
            setResult(res.data)
        } catch (error) {
            toast.error("The Soul Guide is currently meditating. Try again!")
            resetQuiz()
        } finally {
            setLoading(false)
        }
    }

    const resetQuiz = () => {
        setStarted(false)
        setCurrentStep(0)
        setAnswers([])
        setResult(null)
    }

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <AnimatePresence mode="wait">
                    {!started ? (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 md:p-20 text-center border border-zinc-100 dark:border-white/5 shadow-3xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                            <div className="relative z-10 space-y-8">
                                <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <Sparkles size={40} className="animate-pulse" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                        Find your <span className="text-amber-500">Soul Millet</span>
                                    </h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium max-w-lg mx-auto">
                                        Answer 5 lifestyle questions and discover the 'Shree Anna' variety that matches your DNA.
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setStarted(true)}
                                    className="bg-slate-900 dark:bg-amber-500 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl flex items-center gap-4 mx-auto"
                                >
                                    <span>Enter the Matrix</span>
                                    <ArrowRight size={20} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-[500px] flex flex-col items-center justify-center text-center space-y-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-amber-500/20 blur-[80px] rounded-full animate-pulse" />
                                <div className="relative w-32 h-32 bg-white dark:bg-zinc-900 rounded-[3rem] flex items-center justify-center shadow-3xl border border-zinc-100 dark:border-white/5">
                                    <Loader size={48} className="text-amber-500 animate-spin" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Consulting Ancestral Seeds</h3>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Mapping Personality to Nutrition...</p>
                            </div>
                        </motion.div>
                    ) : result ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-zinc-950 rounded-[4rem] p-12 md:p-20 border border-white/10 shadow-3xl relative overflow-hidden text-center"
                        >
                            {/* Result Decoration */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500" />
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                            <div className="relative z-10 space-y-10">
                                <div className="inline-flex items-center gap-2 text-amber-400 font-black uppercase tracking-[0.4em] text-[10px] bg-amber-400/10 px-6 py-2 rounded-full border border-amber-400/20">
                                    <Star size={14} className="fill-current" />
                                    <span>Sync Successful</span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-zinc-500 font-black uppercase tracking-[0.3em] text-sm italic">{result.soulTitle}</h3>
                                    <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
                                        Your soul is <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">{result.milletName}</span>
                                    </h2>
                                </div>

                                <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                                    {result.matchAnalysis}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {result.powerTraits.map((trait: string, i: number) => (
                                        <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-xl">
                                            <Heart size={20} className="text-amber-500 mx-auto mb-3" />
                                            <p className="text-white font-black text-xs uppercase tracking-widest">{trait}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6">
                                    <button
                                        onClick={resetQuiz}
                                        className="text-zinc-500 hover:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors"
                                    >
                                        <RefreshCw size={14} />
                                        <span>Restart Matrix</span>
                                    </button>
                                    <Link href="/marketplace">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-amber-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-amber-500/20"
                                        >
                                            <span>Shop your Match</span>
                                            <ArrowRight size={18} />
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white dark:bg-zinc-900 rounded-[4rem] p-10 md:p-16 border border-zinc-100 dark:border-white/5 shadow-3xl text-center"
                        >
                            <div className="flex justify-center gap-2 mb-12">
                                {QUESTIONS.map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-12 bg-amber-500' : 'w-4 bg-zinc-100 dark:bg-white/5'}`} />
                                ))}
                            </div>

                            <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-12">
                                {QUESTIONS[currentStep].question}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {QUESTIONS[currentStep].options.map((opt) => (
                                    <motion.div
                                        key={opt.value}
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(opt.label)}
                                        className="p-8 bg-zinc-50 dark:bg-white/5 rounded-[3rem] border border-zinc-100 dark:border-white/5 cursor-pointer hover:bg-slate-950 hover:border-amber-500 hover:text-white transition-all group shadow-sm hover:shadow-2xl"
                                    >
                                        <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-400 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-lg">
                                            <opt.icon size={28} />
                                        </div>
                                        <p className="font-black tracking-tight text-lg">{opt.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <style jsx global>{`
                .shadow-3xl {
                    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.1);
                }
                .dark .shadow-3xl {
                    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5);
                }
            `}</style>
        </section>
    )
}

// Internal Link component to avoid import issues if not globally available
function Link({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <a href={href} className="contents">
            {children}
        </a>
    )
}

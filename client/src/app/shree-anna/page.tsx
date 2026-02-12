'use client'

import { motion } from 'motion/react'
import { Wheat, Sun, Droplets, Heart, Shield, Leaf, ArrowRight, Sparkles, Globe, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const MilletHeroBackground = dynamic(() => import('@/components/three/MilletHero'), { ssr: false })
const CardGrain3D = dynamic(() => import('@/components/three/CardGrain3D'), { ssr: false })
import MilletQuiz from '@/components/MilletQuiz'

const millets = [
    {
        name: "Ragi (Finger Millet)",
        hindi: "रागी",
        tagline: "The Calcium Powerhouse",
        nutrients: "344mg Ca per 100g — 3x more than milk",
        color: "from-red-500 to-orange-500",
        hex: "#ef4444",
        bg: "bg-red-50 dark:bg-red-500/5",
        border: "border-red-100 dark:border-red-500/10",
        icon: "🌾",
        benefits: ["Bone health", "Diabetic-friendly", "Gluten-free"]
    },
    {
        name: "Jowar (Sorghum)",
        hindi: "ज्वार",
        tagline: "India's Ancient Superfood",
        nutrients: "Rich in Iron, Phosphorus & Antioxidants",
        color: "from-amber-500 to-yellow-500",
        hex: "#f59e0b",
        bg: "bg-amber-50 dark:bg-amber-500/5",
        border: "border-amber-100 dark:border-amber-500/10",
        icon: "🌿",
        benefits: ["Heart-healthy", "Weight loss", "High fiber"]
    },
    {
        name: "Bajra (Pearl Millet)",
        hindi: "बाजरा",
        tagline: "The Climate Warrior Grain",
        nutrients: "Thrives in 350mm rainfall — True drought crop",
        color: "from-stone-500 to-zinc-500",
        hex: "#78716c",
        bg: "bg-stone-50 dark:bg-stone-500/5",
        border: "border-stone-200 dark:border-stone-500/10",
        icon: "💪",
        benefits: ["Protein-rich", "Energy booster", "Heat-tolerant"]
    },
    {
        name: "Kangni (Foxtail Millet)",
        hindi: "काँगनी",
        tagline: "The Smart Carb",
        nutrients: "Low Glycemic Index — Ideal for diabetes management",
        color: "from-lime-500 to-green-500",
        hex: "#84cc16",
        bg: "bg-lime-50 dark:bg-lime-500/5",
        border: "border-lime-100 dark:border-lime-500/10",
        icon: "🍃",
        benefits: ["Blood sugar control", "Nervous system", "Rich in Iron"]
    },
    {
        name: "Kodo Millet",
        hindi: "कोदो",
        tagline: "The Detox Grain",
        nutrients: "High polyphenol content — Natural antioxidant",
        color: "from-teal-500 to-emerald-500",
        hex: "#14b8a6",
        bg: "bg-teal-50 dark:bg-teal-500/5",
        border: "border-teal-100 dark:border-teal-500/10",
        icon: "🌱",
        benefits: ["Liver health", "Anti-inflammatory", "Weight management"]
    },
    {
        name: "Kutki (Little Millet)",
        hindi: "कुटकी",
        tagline: "Small Grain, Mega Nutrition",
        nutrients: "Rich in B-Vitamins & Minerals",
        color: "from-violet-500 to-purple-500",
        hex: "#8b5cf6",
        bg: "bg-violet-50 dark:bg-violet-500/5",
        border: "border-violet-100 dark:border-violet-500/10",
        icon: "✨",
        benefits: ["Anemia prevention", "Lactation support", "Easy digestion"]
    },
    {
        name: "Sanwa (Barnyard Millet)",
        hindi: "सांवा",
        tagline: "The Fasting Grain",
        nutrients: "High fiber, low calories — Perfect for fasting & diets",
        color: "from-cyan-500 to-blue-500",
        hex: "#06b6d4",
        bg: "bg-cyan-50 dark:bg-cyan-500/5",
        border: "border-cyan-100 dark:border-cyan-500/10",
        icon: "🙏",
        benefits: ["Fasting-friendly", "Gut health", "Low calorie"]
    },
    {
        name: "Cheena (Proso Millet)",
        hindi: "चीना",
        tagline: "The Brain Grain",
        nutrients: "Rich in Lecithin — Supports neural health",
        color: "from-pink-500 to-rose-500",
        hex: "#ec4899",
        bg: "bg-pink-50 dark:bg-pink-500/5",
        border: "border-pink-100 dark:border-pink-500/10",
        icon: "🧠",
        benefits: ["Brain function", "Stress relief", "B-vitamins"]
    },
    {
        name: "Browntop Millet",
        hindi: "ब्राउनटॉप",
        tagline: "The Rarest Superfood",
        nutrients: "12.5g fiber per 100g — Highest among all millets",
        color: "from-emerald-500 to-green-600",
        hex: "#10b981",
        bg: "bg-emerald-50 dark:bg-emerald-500/5",
        border: "border-emerald-100 dark:border-emerald-500/10",
        icon: "🏆",
        benefits: ["Highest fiber", "Diabetes control", "Rare & premium"]
    }
]

const impactStats = [
    { icon: Globe, label: "Farmer States", value: "12+", desc: "Connected across India" },
    { icon: Wheat, label: "Millet Varieties", value: "9", desc: "Shree Anna crops" },
    { icon: TrendingUp, label: "Farmer Income", value: "2.4×", desc: "Average uplift" },
    { icon: Heart, label: "Families Fed", value: "50K+", desc: "With nutritious millets" },
]


export default function ShreeAnnaPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
                <MilletHeroBackground />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-white/50 dark:from-emerald-950/20 dark:via-transparent dark:to-transparent pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 bg-amber-100/80 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border border-amber-200 dark:border-amber-500/20">
                            <Sparkles size={14} />
                            Government of India Initiative
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.9] mb-6">
                            श्री अन्न
                            <br />
                            <span className="bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                                Shree Anna
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                            India declared 2023 as the <strong className="text-zinc-700 dark:text-zinc-300">International Year of Millets</strong>.
                            Millets — recognized as &quot;Shree Anna&quot; — are the cornerstone of nutritional security,
                            climate resilience, and smallholder farmer livelihoods.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/marketplace">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center gap-3"
                                >
                                    Buy Farm-Fresh Millets
                                    <ArrowRight size={18} />
                                </motion.button>
                            </Link>
                            <Link href="/tools/crop-doctor">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 transition-all"
                                >
                                    AI Crop Doctor
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* AI Nutritionist CTA Banner */}
            <section className="relative z-20 -mt-20 mb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group border border-white/5 shadow-3xl"
                    >
                        {/* High-tech background effect */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform group-hover:scale-110" />

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="space-y-6 max-w-2xl">
                                <div className="inline-flex items-center gap-2 text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                                    <Sparkles size={14} className="animate-pulse" />
                                    <span>New: Intelligent Wellness</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                    Your personal AI <br />
                                    <span className="text-emerald-500">Millet Nutritionist</span>
                                </h2>
                                <p className="text-zinc-400 font-medium text-lg">
                                    Struggling to integrate millets? Get a customized 7-day meal plan based on your health goals (Weight Loss, Diabetes, Muscle Gain) in seconds.
                                </p>
                                <Link href="/tools/nutritionist">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center gap-4 group/btn"
                                    >
                                        <span>Start Free Calibration</span>
                                        <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                                    </motion.button>
                                </Link>
                            </div>
                            <div className="relative hidden lg:block">
                                <div className="w-64 h-64 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl p-8 flex flex-col justify-center items-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                        <Heart size={32} className="text-white fill-current" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-white">99%</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bio-Accuracy</div>
                                    </div>
                                </div>
                                {/* Floating Tags */}
                                <div className="absolute -top-4 -right-4 bg-zinc-800 border border-white/5 p-3 rounded-2xl shadow-2xl flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Weight Loss</span>
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-zinc-800 border border-white/5 p-3 rounded-2xl shadow-2xl flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Diabetes Care</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <MilletQuiz />

            {/* Why Millets Section */}
            <section className="py-20 md:py-28 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
                            Why Shree Anna?
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">
                            Three pillars that make millets the future of food.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Heart,
                                title: "Nutritional Security",
                                desc: "Power-packed with calcium, iron, fiber, and protein. Millets combat malnutrition and lifestyle diseases — nature's multivitamin.",
                                color: "text-red-500",
                                bg: "bg-red-50 dark:bg-red-500/5"
                            },
                            {
                                icon: Sun,
                                title: "Climate Resilience",
                                desc: "Millets thrive in extreme heat, drought, and poor soil. They require 70% less water than rice — the true warrior crops of climate change.",
                                color: "text-amber-500",
                                bg: "bg-amber-50 dark:bg-amber-500/5"
                            },
                            {
                                icon: Shield,
                                title: "Farmer Livelihoods",
                                desc: "Low-input, high-output crops that secure smallholder farmer incomes. Fair pricing through AgrowCart eliminates middlemen exploitation.",
                                color: "text-emerald-500",
                                bg: "bg-emerald-50 dark:bg-emerald-500/5"
                            }
                        ].map((pillar, i) => (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-white dark:bg-zinc-900/60 rounded-3xl p-8 border border-zinc-100 dark:border-white/5 shadow-xl shadow-zinc-900/5"
                            >
                                <div className={`w-14 h-14 ${pillar.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                    <pillar.icon size={24} className={pillar.color} />
                                </div>
                                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">{pillar.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9 Millets Showcase */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
                            The 9 Major Millets
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">
                            Each grain carries centuries of nutrition. Discover what makes every millet unique.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {millets.map((millet, i) => (
                            <motion.div
                                key={millet.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -6 }}
                                className={`${millet.bg} ${millet.border} border rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-500 premium-depth-hover`}
                            >
                                <CardGrain3D color={millet.hex} />
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="text-3xl">{millet.icon}</span>
                                        <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight mt-2">{millet.name}</h3>
                                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{millet.hindi}</p>
                                    </div>
                                    <div className={`bg-gradient-to-br ${millet.color} text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full`}>
                                        {millet.tagline}
                                    </div>
                                </div>

                                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mb-4 leading-relaxed">
                                    {millet.nutrients}
                                </p>

                                <div className="flex flex-wrap gap-1.5">
                                    {millet.benefits.map(b => (
                                        <span key={b} className="text-[9px] font-bold uppercase tracking-widest bg-white/70 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded-full border border-zinc-200/50 dark:border-white/5">
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-20 md:py-28 bg-zinc-900 dark:bg-zinc-900/80">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                            AgrowCart Impact
                        </h2>
                        <p className="text-zinc-400 max-w-xl mx-auto text-lg">
                            Bridging the gap between farmers and consumers, powered by AI.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {impactStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-sm"
                            >
                                <stat.icon size={28} className="text-emerald-400 mx-auto mb-4" />
                                <div className="text-4xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                                <div className="text-xs text-zinc-500">{stat.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20">
                            <Leaf size={12} />
                            Join the Millet Revolution
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-6">
                            From Our Farmers&apos; Fields
                            <br />
                            <span className="text-emerald-600 dark:text-emerald-400">To Your Family&apos;s Table</span>
                        </h2>

                        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
                            Every purchase on AgrowCart directly supports a smallholder farmer.
                            Zero middlemen. Full traceability. Real impact.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/marketplace">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center gap-3"
                                >
                                    <Wheat size={18} />
                                    Shop Millets Now
                                </motion.button>
                            </Link>
                            <Link href="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 transition-all flex items-center gap-3"
                                >
                                    <Droplets size={18} />
                                    Register as Farmer
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}

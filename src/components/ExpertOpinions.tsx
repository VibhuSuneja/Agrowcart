'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Quote, User, Stethoscope, HeartPulse, Leaf } from 'lucide-react'
import Image from 'next/image'

function ExpertOpinions() {
    const experts = [
        {
            name: "Dr. Khadar Vali",
            title: "The Millet Man of India",
            image: "/experts/khadar-vali.png",
            quote: "When food is wrong, medicine is of no use. When food is right, medicine is of no need. Millets are the true superfoods that can reverse lifestyle diseases.",
            highlight: "Reversing Diabetes & Lifestyle Diseases",
            icon: <Leaf className="w-5 h-5 text-green-500" />
        },
        {
            name: "Dr. B.M. Hegde",
            title: "Renowned Cardiologist & Educator",
            image: "/experts/bm-hegde.png",
            quote: "Modern diet has moved us away from our roots. Millets are not just poor man's food; they are rich man's health. They are the answer to diabetes and heart disease.",
            highlight: "Heart Health & Holistic Living",
            icon: <HeartPulse className="w-5 h-5 text-red-500" />
        },
        {
            name: "Clinical Nutritionist Insights",
            title: "Modern Nutritional Science",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60", // Placeholder for nutritionist
            quote: "Millets are naturally gluten-free and alkaline. They release sugar slowly into the bloodstream (low GI), making them the perfect food for sustained energy and gut health.",
            highlight: "Gluten-Free & Low GI",
            icon: <Stethoscope className="w-5 h-5 text-blue-500" />
        }
    ]

    return (
        <section className="py-24 bg-zinc-900 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-600/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/30 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <Stethoscope size={14} />
                        <span>Expert Verification</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Why Experts Recommends<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Millets for Health</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Leading doctors and nutritionists advocate for returning to traditional grains. Here's what they say about the power of millets.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {experts.map((expert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-3xl p-8 hover:bg-zinc-800 transition-all group hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-900/10"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-zinc-700 group-hover:border-green-500 transition-colors">
                                        <Image
                                            src={expert.image}
                                            alt={expert.name}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-zinc-900 rounded-lg p-1.5 border border-zinc-700 group-hover:border-green-500/50 transition-colors">
                                        {expert.icon}
                                    </div>
                                </div>
                                <Quote className="text-zinc-600 group-hover:text-green-500 transition-colors w-10 h-10 opacity-50" />
                            </div>

                            <blockquote className="mb-8">
                                <p className="text-zinc-300 text-lg leading-relaxed italic relative z-10">
                                    "{expert.quote}"
                                </p>
                            </blockquote>

                            <div className="border-t border-zinc-700/50 pt-6">
                                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-green-400 transition-colors">{expert.name}</h3>
                                <p className="text-zinc-500 text-sm font-medium uppercase tracking-wide mb-4">{expert.title}</p>

                                <div className="inline-flex items-center gap-2 bg-zinc-900/50 rounded-lg px-3 py-2 text-xs font-bold text-zinc-400 group-hover:text-green-400 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    {expert.highlight}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <p className="text-zinc-500 text-sm">
                        *Disclaimer: Information provided is for educational purposes and motivation. Please consult your doctor for medical advice.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

export default ExpertOpinions

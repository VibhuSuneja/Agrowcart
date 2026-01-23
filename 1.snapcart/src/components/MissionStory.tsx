'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Sparkles, Quote, GraduationCap, MapPin, Rocket } from 'lucide-react'
import Image from 'next/image'

function MissionStory() {
    return (
        <section className="w-[95%] md:w-[85%] mx-auto mt-32 mb-20">
            <div className="relative bg-zinc-900 rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
                    {/* Left: Content */}
                    <div className="p-12 md:p-20 flex flex-col justify-center space-y-10">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full"
                            >
                                <Sparkles className="text-green-400" size={16} />
                                <span className="text-green-400 text-xs font-black uppercase tracking-wider">The Visionary Journey</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter"
                            >
                                From Classroom to <span className="text-green-400 font-serif italic mb-2 block">Global Impact.</span>
                            </motion.h2>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="relative"
                        >
                            <Quote className="absolute -left-8 -top-8 text-white/5 w-24 h-24" />
                            <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed font-medium italic relative z-10">
                                "I got inspiration to solve the millet value chain crisis while witnessing the gap between farm-gate prices and market demand. As a <span className="text-white font-bold">3rd-year ambitious student</span>, I believe technology is the ultimate lever for agricultural equity."
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-[2rem]">
                                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Studying at</div>
                                    <div className="text-sm font-bold text-white">JMIT Radaur</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-[2rem]">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Base Hub</div>
                                    <div className="text-sm font-bold text-white">Kurukshetra</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Founder Card / Visual */}
                    <div className="bg-white/5 border-l border-white/5 p-12 md:p-20 flex flex-col justify-center items-center relative overflow-hidden">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="relative z-10 bg-linear-to-br from-zinc-800 to-zinc-900 p-1 rounded-[3.5rem] shadow-2xl"
                        >
                            <div className="bg-zinc-900 rounded-[3.4rem] p-10 text-center space-y-6 max-w-sm">
                                <div className="w-32 h-32 bg-green-600 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-lg shadow-green-600/20 text-white">
                                    <Rocket size={48} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">Vibhu Suneja</h3>
                                    <p className="text-green-500 font-bold uppercase tracking-widest text-[10px] mt-1">Founding Visionary • +91 94681 50076</p>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <div className="text-left">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Age</div>
                                        <div className="text-lg font-black text-white">21 Years</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</div>
                                        <div className="text-sm font-black text-green-400 uppercase tracking-widest">Ambition Mode</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Abstract background graphics */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20">
                            <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-10 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MissionStory

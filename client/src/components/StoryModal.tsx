'use client'
import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Sparkles, Rocket, Quote } from 'lucide-react'

interface StoryModalProps {
    isOpen: boolean
    onClose: () => void
}

function StoryModal({ isOpen, onClose }: StoryModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="relative p-8 pb-4 shrink-0 flex items-center justify-between z-10 bg-zinc-900/90 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 border border-green-500/20">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">Our Journey</h3>
                                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">From Idea to Reality</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-8 pt-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
                            <div className="space-y-8">
                                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                            <Rocket size={16} />
                                        </div>
                                        <h4 className="text-lg font-bold text-white">The Spark (Initial Vision)</h4>
                                    </div>
                                    <p className="text-zinc-400 leading-relaxed text-sm">
                                        It started with a focus on solving a critical gap in the agricultural supply chain: <span className="text-white font-semibold">"Value Chain for Millets"</span>.
                                        We saw that while millets were being promoted, the farmers were still disconnected from the real value. Middlemen ate the profits, and consumers paid a premium for questionable quality.
                                    </p>
                                </div>

                                <div className="relative pl-6 border-l-2 border-zinc-800 space-y-8">
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-500" />
                                        <h5 className="text-green-400 font-black uppercase tracking-widest text-xs mb-2">Phase 1: Discovery</h5>
                                        <p className="text-zinc-300 text-sm leading-relaxed">
                                            We visited local farms in Radaur and Kurukshetra. The reality was harsh—farmers didn't know the market price until they reached the handy. We knew technology had to bridge this information gap.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        <h5 className="text-green-400 font-black uppercase tracking-widest text-xs mb-2">Phase 2: Execution</h5>
                                        <p className="text-zinc-300 text-sm leading-relaxed">
                                            We built a prototype focusing on three pillars: <span className="text-white">Traceability, Fair Pricing, and Direct Access</span>.
                                            What was just a slide deck is now a fully functional platform connecting over 50+ farmers directly to urban households.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-linear-to-r from-green-900/20 to-emerald-900/20 rounded-3xl p-8 border border-green-500/20 text-center">
                                    <Quote className="mx-auto text-green-500/40 mb-4" size={32} />
                                    <p className="text-xl font-black text-white italic tracking-tight mb-4">
                                        "We are not just selling grains; we are restoring dignity to the hands that feed us."
                                    </p>
                                    <div className="inline-block bg-green-500 text-black font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                                        Mission Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default StoryModal

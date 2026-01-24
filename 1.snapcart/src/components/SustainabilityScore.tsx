'use client'

import React from 'react'
import { Droplets, Sprout, TrendingDown } from 'lucide-react'
import { motion } from 'motion/react'

export default function SustainabilityScore({ quantity, unit }: { quantity: number, unit: string }) {
    // Water Footprint Constants (Liters per kg)
    // Rice: ~2500, Wheat: ~1200, average ~1850
    // Millets: ~250
    // Standard saving: ~1600L per kg

    // Convert unit to kg equivalent
    let multiplier = 0
    switch (unit.toLowerCase()) {
        case 'kg': multiplier = 1; break
        case 'g': multiplier = 0.001; break
        case 'quintal': multiplier = 100; break
        case 'pack': multiplier = 0.5; break // Assuming 500g average pack
        default: multiplier = 1
    }

    const waterSaved = Math.round(quantity * multiplier * 1600)

    if (waterSaved <= 0) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-linear-to-br from-blue-600 to-cyan-500 p-6 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-blue-500/20 group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />

            <div className="flex items-center gap-3 text-blue-100 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                <Sprout size={14} />
                <span>Sustainability Impact</span>
            </div>

            <div className="flex items-end justify-between gap-4">
                <div>
                    <div className="text-4xl font-black tracking-tighter flex items-center gap-2">
                        {waterSaved.toLocaleString()}L
                        <Droplets className="text-blue-200 animate-bounce" size={24} />
                    </div>
                    <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">
                        Water Saved vs. Rice/Wheat
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-1">
                        <TrendingDown size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Eco-Score: A+</span>
                </div>
            </div>

            <p className="mt-4 text-[10px] text-blue-50/70 font-medium leading-relaxed">
                By choosing millets, you directly contribute to groundwater conservation in water-stressed agricultural regions.
            </p>
        </motion.div>
    )
}

'use client'

import React from 'react'
import { motion, Variants } from 'motion/react'
import { MapPin, Sprout, ShieldCheck, Truck, Home } from 'lucide-react'

interface TraceabilityMapProps {
    status?: string
}

const TraceabilityMap: React.FC<TraceabilityMapProps> = ({ status = 'delivered' }) => {
    const nodes = [
        { id: 'farm', icon: Sprout, label: 'Origin Farm', location: 'Kolar, Karnataka', color: 'text-green-500', bg: 'bg-green-50', cx: '10%', cy: '70%' },
        { id: 'lab', icon: ShieldCheck, label: 'Quality Lab', location: 'Bangalore Central', color: 'text-blue-500', bg: 'bg-blue-50', cx: '40%', cy: '30%' },
        { id: 'logistics', icon: Truck, label: 'Logistics Hub', location: 'Regional Center', color: 'text-amber-500', bg: 'bg-amber-50', cx: '70%', cy: '60%' },
        { id: 'buyer', icon: Home, label: 'Destination', location: 'Your Doorstep', color: 'text-purple-500', bg: 'bg-purple-50', cx: '90%', cy: '20%' },
    ]

    // Animation variants
    const pathVariants: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 2, ease: "easeInOut" }
        }
    }

    return (
        <div className="relative w-full aspect-[21/9] bg-white/50 backdrop-blur-3xl rounded-[3rem] border border-zinc-100 overflow-hidden p-8 shadow-2xl shadow-green-900/5">
            {/* Background Subtle Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
                {/* Animated Paths */}
                <motion.path
                    d="M 100 280 Q 250 100 400 120 T 700 240 T 900 80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    variants={pathVariants}
                    initial="hidden"
                    animate="visible"
                />

                {/* Gradient for Path */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="33%" stopColor="#3b82f6" />
                        <stop offset="66%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>

                {/* Nodes */}
                {nodes.map((node, index) => {
                    const Icon = node.icon
                    const x = parseInt(node.cx) * 10
                    const y = parseInt(node.cy) * 4

                    return (
                        <foreignObject key={node.id} x={x - 60} y={y - 60} width="120" height="150" className="overflow-visible">
                            <motion.div
                                initial={{ opacity: 0, scale: 0, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.4 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${node.bg} ${node.color} flex items-center justify-center shadow-lg border border-white relative group cursor-help transition-transform hover:scale-110`}>
                                    <Icon size={24} />
                                    {/* Pulsing indicator if active or previous */}
                                    <div className={`absolute -inset-1 rounded-[1.2rem] border-2 border-current opacity-20 animate-ping`} />

                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 bg-zinc-900 text-white p-3 rounded-2xl text-[10px] font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                                        <div className="font-black uppercase tracking-widest mb-1 text-zinc-400">{node.label}</div>
                                        <div>{node.location}</div>
                                        <div className="mt-2 text-green-400">Verified Protocol ✓</div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-zinc-900" />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-900">{node.label}</div>
                                    <div className="text-[8px] font-bold text-zinc-400">{node.location}</div>
                                </div>
                            </motion.div>
                        </foreignObject>
                    )
                })}
            </svg>

            {/* Status Overlay */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live Provenance Map
                </div>
            </div>
        </div>
    )
}

export default TraceabilityMap

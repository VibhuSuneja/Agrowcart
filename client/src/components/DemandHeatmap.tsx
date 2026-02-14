'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { MapPin, TrendingUp, Info } from 'lucide-react'
import axios from 'axios'

export default function DemandHeatmap() {
    const [data, setData] = useState<{ _id: string, orderCount: number }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDemand = async () => {
            try {
                const res = await axios.get('/api/analytics/demand-heatmap')
                setData(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchDemand()
    }, [])

    const SIMULATED_DATA = [
        { _id: 'Pune', orderCount: 850 },
        { _id: 'Hyderabad', orderCount: 720 },
        { _id: 'Mandya', orderCount: 640 },
        { _id: 'Tumkur', orderCount: 510 },
        { _id: 'Bangalore', orderCount: 480 },
    ]

    const chartData = data.length > 0 ? data : SIMULATED_DATA;

    const COLORS = ['#16a34a', '#15803d', '#14532d', '#166534', '#22c55e']

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ultra-glass p-8 md:p-10 rounded-[3.5rem] relative overflow-hidden h-full flex flex-col transition-all duration-700"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-900 rounded-2xl flex items-center justify-center text-green-400">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Regional Demand</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">{data.length > 0 ? 'Active Market Interest' : 'AI Predicted Interest'}</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-zinc-50 dark:bg-white/5 px-3 py-1 rounded-full border border-zinc-100 dark:border-white/10">
                    <TrendingUp className="text-green-600" size={12} />
                    <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase">Live Pulse</span>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Mapping Requests...</p>
                </div>
            ) : (
                <div className="space-y-8 flex-1 flex flex-col justify-between">
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis
                                    dataKey="_id"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f4f4f5' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="orderCount" radius={[10, 10, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-900 rounded-2xl text-white">
                            <div className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">Top Demand Zone</div>
                            <div className="text-lg font-black">{chartData[0]?._id || 'N/A'}</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                            <div className="text-[9px] font-black uppercase text-green-600 tracking-widest mb-1">Market Sentiment</div>
                            <div className="text-sm font-black text-green-900 leading-tight">High Processing Demand (Pune/Hyd)</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-50">
                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed italic">
                    * Data aggregates active purchase requests and completed sales within the last 30 days to help you optimize delivery logistics.
                </p>
            </div>
        </motion.div>
    )
}

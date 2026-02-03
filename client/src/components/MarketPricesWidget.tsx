'use client'
import React, { useEffect, useState } from 'react'
import { TrendingUp, RefreshCcw, Loader } from 'lucide-react'
import { motion } from 'motion/react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function MarketPricesWidget() {
    const [prices, setPrices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<string>('')

    const fetchPrices = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/market-prices')
            setPrices(res.data.data)
            setLastUpdated(new Date().toLocaleTimeString())
        } catch (error) {
            toast.error('Failed to fetch market prices')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPrices()
    }, [])

    return (
        <div className="bg-green-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-green-900/40 relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-white/70 font-black uppercase tracking-[0.3em] text-[10px]">
                        <TrendingUp size={14} />
                        <span>Live Market</span>
                    </div>
                    <button
                        onClick={fetchPrices}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        title="Refresh prices"
                    >
                        <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <h3 className="text-3xl font-black leading-tight tracking-tight">Today's <br />Millet Rates</h3>
                {lastUpdated && (
                    <p className="text-white/60 text-xs mt-2">Updated: {lastUpdated}</p>
                )}
            </div>

            <div className="space-y-3 relative z-10 flex-1 overflow-y-auto custom-scrollbar-white pr-2">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="animate-spin text-white" size={24} />
                    </div>
                ) : (
                    prices.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl cursor-pointer group backdrop-blur-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-sm">{item.crop}</h4>
                                <div className="text-right">
                                    <div className="text-lg font-black">₹{item.price}</div>
                                    <div className="text-[10px] text-white/60">/{item.unit}</div>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/80 font-medium">
                                {item.market}
                            </p>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}

'use client'
import React, { useEffect, useState } from 'react'
import { Newspaper, Globe, RefreshCcw, Loader2, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'

const LANGUAGES = [
    { code: 'English', label: 'English' },
    { code: 'Hindi', label: 'हिंदी' },
    { code: 'Marathi', label: 'मराठी' },
    { code: 'Punjabi', label: 'ਪੰਜਾਬੀ' },
    { code: 'Tamil', label: 'தமிழ்' },
    { code: 'Telugu', label: 'తెలుగు' }
]

const FALLBACK_NEWS = [
    { headline: "Government Announces New MSP for Rabi Crops", summary: "The Centre has hiked the Minimum Support Price for wheat and mustard to support farmers.", tag: "Policy" },
    { headline: "Heavy Rains Predicted in Vidarbha", summary: "IMD forecasts scattered rainfall over the next 48 hours. Farmers advised to cover harvested produce.", tag: "Weather" },
    { headline: "Drone Sprayers Gaining Popularity", summary: "Subsidies for agricultural drones are driving adoption among young farmers in Maharashtra.", tag: "Tech" }
]

export default function NewsCard() {
    const [news, setNews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [language, setLanguage] = useState('English')

    const fetchNews = async () => {
        setLoading(true)
        try {
            const res = await axios.post('/api/ai/news', { language })
            setNews(res.data.news)
        } catch (error: any) {
            console.error(error)
            toast.error("AI service busy. Showing latest updates.")
            setNews(FALLBACK_NEWS)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNews()
    }, [language])

    const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-zinc-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                        <Newspaper size={14} />
                        <span>Daily Insights</span>
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Farmer's News</h3>
                    <p className="text-zinc-400 text-xs font-medium">{date}</p>
                </div>

                <div className="flex gap-2">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-zinc-50 border border-zinc-200 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-500/20"
                    >
                        {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>{l.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {loading ? (
                    <div className="flex items-center justify-center py-10 text-zinc-400">
                        <Loader2 className="animate-spin mb-2" />
                    </div>
                ) : (
                    news.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                            onClick={() => item.url && window.open(item.url, '_blank')}
                        >
                            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100 group relative">
                                <span className={`shrink-0 w-2 h-2 mt-2 rounded-full ${item.tag === 'Policy' ? 'bg-blue-500' :
                                    item.tag === 'Market' ? 'bg-green-500' : 'bg-orange-500'
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.tag === 'Policy' ? 'bg-blue-50 text-blue-600' :
                                            item.tag === 'Market' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {item.tag}
                                        </span>
                                        <ExternalLink size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h4 className="font-bold text-zinc-800 leading-tight mb-1 group-hover:text-red-600 transition-colors">
                                        {item.headline}
                                    </h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                        {item.summary}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center px-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Powered by Gemini AI</span>
                <button
                    onClick={fetchNews}
                    className="p-2 bg-zinc-50 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                    title="Refresh News"
                >
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
        </div>
    )
}

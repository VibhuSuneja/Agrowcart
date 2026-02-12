'use client'
import React, { useEffect, useState } from 'react'
import { CloudRain, Sun, Droplets, Wind, Thermometer, BrainCircuit, Loader2, Search, X } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import toast from 'react-hot-toast'

export default function WeatherCard() {
    const [loading, setLoading] = useState(true)
    const [weather, setWeather] = useState<any>(null)
    const [advice, setAdvice] = useState<any>(null)
    const [aiLoading, setAiLoading] = useState(false)
    const [aiError, setAiError] = useState<string | null>(null)

    // Search State
    const [locationName, setLocationName] = useState('Nagpur, MH')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const fetchWeather = async (lat: number, lon: number, name: string) => {
        setLoading(true)
        setLocationName(name)
        try {
            const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max&timezone=auto`)

            const data = res.data;
            const formattedWeather = {
                daily: data.daily.time.slice(0, 5).map((date: string, i: number) => ({
                    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                    maxTemp: data.daily.temperature_2m_max[i],
                    minTemp: data.daily.temperature_2m_min[i],
                    rain: data.daily.precipitation_sum[i],
                    humidity: data.daily.relative_humidity_2m_max[i]
                }))
            }
            setWeather(formattedWeather)

            // Get AI Advice based on this
            getAiAdvice(formattedWeather)

        } catch (error) {
            console.error("Weather fetch failed", error)
            toast.error("Failed to fetch weather data")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        try {
            const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=1&language=en&format=json`)
            if (res.data.results && res.data.results.length > 0) {
                const loc = res.data.results[0]
                const name = `${loc.name}, ${loc.admin1 || loc.country_code}`
                await fetchWeather(loc.latitude, loc.longitude, name)
                setIsSearchOpen(false)
                setSearchQuery('')
            } else {
                toast.error("Location not found")
            }
        } catch (error) {
            toast.error("Search failed")
        }
    }

    useEffect(() => {
        // Default Location: Nagpur
        fetchWeather(20.59, 78.96, 'Nagpur, MH')
    }, [])

    const getAiAdvice = async (weatherData: any) => {
        setAiLoading(true)
        setAiError(null)
        try {
            const res = await axios.post('/api/ai/farmer-advice', { weatherData })
            setAdvice(res.data.advice)
        } catch (error: any) {
            console.error("AI Advice failed", error)
            if (error.response?.status === 429) {
                setAiError("AI Rate Limit reached.")
            } else {
                setAiError("Advisory Engine Offline")
            }
        } finally {
            setAiLoading(false)
        }
    }

    if (loading && !weather) return <div className="h-48 bg-zinc-100 rounded-2xl animate-pulse" />

    const today = weather?.daily[0]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-100 overflow-hidden relative"
        >
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-0" />

            {/* Header / Search */}
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="flex items-center gap-2 text-lg font-black text-zinc-900">
                            <CloudRain className="text-blue-500" size={20} />
                            Agri-Forecast
                        </h3>
                        {!isSearchOpen && (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-1.5 bg-zinc-100 text-zinc-500 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                title="Search Location"
                                aria-label="Search location"
                            >
                                <Search size={14} />
                            </button>
                        )}
                    </div>

                    {isSearchOpen ? (
                        <form onSubmit={handleSearch} className="flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-top-1">
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Enter City (e.g. Pune)..."
                                className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900"
                            />
                            <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 bg-zinc-100 rounded-lg hover:bg-zinc-200" aria-label="Close search">
                                <X size={14} className="text-zinc-500" />
                            </button>
                        </form>
                    ) : (
                        <p className="text-xs text-zinc-500 font-medium">
                            {locationName} • Next 5 Days
                        </p>
                    )}
                </div>

                {!isSearchOpen && (
                    <div className="text-right shrink-0">
                        <div className="text-3xl font-black text-zinc-900">{today?.maxTemp}° <span className="text-lg text-zinc-400 font-medium">/ {today?.minTemp}°</span></div>
                        <div className="text-xs text-blue-600 font-bold flex items-center justify-end gap-1">
                            <Droplets size={10} /> {today?.humidity}% Hum
                        </div>
                    </div>
                )}
            </div>

            {/* Weekly Grid */}
            <div className="grid grid-cols-5 gap-2 text-center mb-6 relative z-10">
                {weather?.daily.map((day: any, i: number) => (
                    <div key={i} className={`p-2 rounded-xl border ${i === 0 ? 'bg-blue-50 border-blue-100' : 'bg-transparent border-transparent'}`}>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">{day.date}</div>
                        <div className="text-sm font-black text-zinc-700 mb-1">{Math.round(day.maxTemp)}°</div>
                        {day.rain > 0 ? (
                            <div className="flex justify-center text-blue-500"><CloudRain size={12} /></div>
                        ) : (
                            <div className="flex justify-center text-yellow-500"><Sun size={12} /></div>
                        )}
                    </div>
                ))}
            </div>

            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-4 text-white relative z-10 shadow-lg shadow-green-600/20">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md shrink-0">
                        {aiLoading ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-1 opacity-90">AI Crop Advisory</h4>
                        {aiLoading ? (
                            <div className="h-10 bg-white/20 rounded animate-pulse w-full" />
                        ) : advice ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium leading-tight">{advice.summary}</p>
                                <div className="flex gap-2 text-xs font-bold bg-white/10 p-2 rounded-lg border border-white/10">
                                    <span className="text-emerald-200">ACTION:</span>
                                    <span>{advice.action}</span>
                                </div>
                                {advice.risk && (
                                    <div className="flex gap-2 text-xs font-bold bg-red-500/20 p-2 rounded-lg border border-red-500/20 text-red-100">
                                        <span>RISK:</span>
                                        <span>{advice.risk}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs opacity-75">{aiError || "Analyzing weather patterns..."}</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

'use client'
import React, { useState } from 'react'
import { Calendar, MapPin, Users, ArrowRight, Plus, Star, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const STATIC_EVENTS = [
    {
        id: '1',
        title: 'Lohri (Rabi Harvest)',
        date: '2026-01-13',
        location: 'Punjab, North India',
        type: 'festival',
        tags: ['Harvest', 'Tradition']
    },
    {
        id: '2',
        title: 'Makar Sankranti / Pongal',
        date: '2026-01-14',
        location: 'Nationwide',
        type: 'festival',
        tags: ['Festival', 'Sun God']
    },
    {
        id: '3',
        title: 'Agri Vision 2026',
        date: '2026-01-28',
        location: 'Bhubaneswar, Odisha',
        type: 'expo',
        tags: ['Conference', 'Sustainable Agri']
    },
    {
        id: '4',
        title: 'India Agri Expo 2026',
        date: '2026-01-30',
        location: 'Ludhiana, Punjab',
        type: 'expo',
        tags: ['Technology', 'Machinery']
    },
    {
        id: '5',
        title: 'Global AgroTech 2026',
        date: '2026-02-26',
        location: 'Lucknow, UP',
        type: 'expo',
        tags: ['Innovation', 'Investments']
    },
    {
        id: '6',
        title: 'Holi (Rabi Season)',
        date: '2026-03-03',
        location: 'Nationwide',
        type: 'festival',
        tags: ['Colors', 'Spring']
    },
    {
        id: '7',
        title: 'Krishi Mach Expo',
        date: '2026-03-13',
        location: 'Chandigarh',
        type: 'expo',
        tags: ['Equipment', 'Trade']
    }
]

export default function EventCalendar() {
    const [events, setEvents] = useState(STATIC_EVENTS)
    const [filter, setFilter] = useState<'all' | 'festival' | 'expo' | 'meeting'>('all')

    const filteredEvents = events.filter(e => filter === 'all' || e.type === filter)

    // Sort by date (closest first)
    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return (
        <div className="bg-white rounded-[3.5rem] p-8 md:p-10 shadow-2xl shadow-green-900/5 border border-zinc-100 flex flex-col h-full relative overflow-hidden">

            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                            <Calendar size={14} />
                            <span>Agri-Schedule</span>
                        </div>
                        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Events & <br />Festivals</h2>
                    </div>
                    <button className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform">
                        <Plus size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {['all', 'festival', 'expo'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${filter === f
                                ? 'bg-zinc-900 text-white'
                                : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Event List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mt-4">
                    {filteredEvents.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white border border-zinc-100 p-5 rounded-[1.5rem] hover:shadow-lg hover:border-orange-200 transition-all group cursor-pointer"
                            onClick={() => toast.success(`Viewing details for ${event.title}`)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${event.type === 'festival' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                    event.type === 'expo' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-green-50 border-green-100 text-green-600'
                                    }`}>
                                    <span className="text-[10px] font-bold uppercase">{format(new Date(event.date), 'MMM')}</span>
                                    <span className="text-xl font-black leading-none">{format(new Date(event.date), 'dd')}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-zinc-900 truncate group-hover:text-orange-600 transition-colors">{event.title}</h4>
                                    <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1 mb-2">
                                        <MapPin size={12} />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {event.tags.map(tag => (
                                            <span key={tag} className="bg-zinc-50 text-zinc-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

'use client'
import React, { useState } from 'react'
import { Calendar, MapPin, Users, ArrowRight, Plus, Star, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { X, ExternalLink, Info } from 'lucide-react'
import { AnimatePresence } from 'motion/react'

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
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

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
                            onClick={() => {
                                setSelectedEvent(event);
                                toast.success(`Viewing info for ${event.title}`);
                            }}
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

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xl"
                            onClick={() => setSelectedEvent(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] max-w-md w-full shadow-3xl relative z-[160] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`h-32 flex items-center justify-center ${selectedEvent.type === 'festival' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                                <Calendar size={48} className="text-white opacity-20" />
                                <div className="absolute top-6 right-6">
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedEvent.type === 'festival' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {selectedEvent.type}
                                    </span>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{format(new Date(selectedEvent.date), 'PPPP')}</span>
                                </div>

                                <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-4">{selectedEvent.title}</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-zinc-400 mt-1" size={18} />
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Location</p>
                                            <p className="text-zinc-700 font-bold">{selectedEvent.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Info className="text-zinc-400 mt-1" size={18} />
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Description</p>
                                            <p className="text-zinc-600 text-sm font-medium leading-relaxed">
                                                Join thousands of farmers and industry experts at {selectedEvent.title}. Discover modern techniques, local traditions, and networking opportunities.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedEvent.title + ' ' + selectedEvent.location)}`, '_blank');
                                        setSelectedEvent(null);
                                    }}
                                    className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-zinc-900/10"
                                >
                                    <span>Visit Official Site</span>
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

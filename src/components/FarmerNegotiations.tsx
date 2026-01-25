'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageSquare, User, Send, ChevronRight, Sparkle, Loader, Phone, PhoneIncoming, X } from 'lucide-react'
import axios from 'axios'
import NegotiationChat from './NegotiationChat'
import { useSocket } from '@/context/SocketContext'

export default function FarmerNegotiations({ farmerId }: { farmerId: string }) {
    const { socket, joinRoom, isConnected } = useSocket()
    const [rooms, setRooms] = useState<any[]>([])
    const [selectedRoom, setSelectedRoom] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchRooms = async () => {
        try {
            const res = await axios.get('/api/chat/farmer-rooms')
            setRooms(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Poll for rooms & Join socket rooms
    useEffect(() => {
        fetchRooms()
        const interval = setInterval(fetchRooms, 15000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (socket && isConnected && rooms.length > 0) {
            rooms.forEach(room => {
                joinRoom(room._id)
                console.log(`📡 Farmer Hub: Monitoring Room [${room._id}] via Global Socket`)
            })
        }
    }, [rooms, socket, isConnected, joinRoom])

    if (loading) return null

    return (
        <div className="space-y-8 relative pt-12 mt-12 border-t border-zinc-100">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <h2 className='text-4xl font-black text-zinc-900 tracking-tight'>Sales Negotiations</h2>
                    <p className="text-zinc-500 font-medium">Direct inquiries from potential bulk buyers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => {
                    const buyerId = room._id.split(':').pop()
                    return (
                        <motion.div
                            key={room._id}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-xl shadow-zinc-900/5 group cursor-pointer relative overflow-hidden"
                            onClick={() => setSelectedRoom(room)}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-green-400">
                                    <User size={24} />
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{room.lastTime}</div>
                                    <div className="text-[9px] font-black text-green-600 uppercase tracking-widest mt-1">Active</div>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-zinc-900 mb-2 truncate">Buyer #{buyerId.slice(-6).toUpperCase()}</h3>
                            <p className="text-zinc-500 text-sm font-medium line-clamp-2 italic mb-6">"{room.lastMessage}"</p>

                            <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Negotiation Room</span>
                                <ChevronRight className="text-zinc-300 group-hover:text-green-600 transition-colors" />
                            </div>
                        </motion.div>
                    )
                })}

                {rooms.length === 0 && (
                    <div className="lg:col-span-3 py-20 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-zinc-200">
                        <MessageSquare className="text-zinc-200 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-black text-zinc-800">No active inquiries</h3>
                        <p className="text-zinc-500">New buyer inquiries will appear here automatically.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedRoom && (
                    <NegotiationChat
                        key={selectedRoom._id}
                        productId="bulk"
                        buyerId={selectedRoom._id.split(':').pop()}
                        farmerId={farmerId}
                        farmerName="Farmer"
                        buyerName={`Buyer #${selectedRoom._id.split(':').pop().slice(-4).toUpperCase()}`}
                        currentUserRole="farmer"
                        onClose={() => {
                            setSelectedRoom(null)
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageSquare, User, Send, ChevronRight, Sparkle, Loader, Phone, PhoneIncoming, X } from 'lucide-react'
import axios from 'axios'
import NegotiationChat from './NegotiationChat'
import { getSocket } from '@/lib/socket'

export default function FarmerNegotiations({ farmerId }: { farmerId: string }) {
    const [rooms, setRooms] = useState<any[]>([])
    const [selectedRoom, setSelectedRoom] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [incomingCall, setIncomingCall] = useState<{ roomId: string, signal: any, from: string } | null>(null)
    const joinedRoomsRef = useRef<Set<string>>(new Set())

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

    // Poll for rooms and manage socket connections
    useEffect(() => {
        fetchRooms()
        const interval = setInterval(fetchRooms, 10000)

        // Socket Listener Manager
        const socket = getSocket()

        const attachListeners = () => {
            if (!socket) return

            // Join all active rooms to listen for calls
            rooms.forEach(room => {
                if (!joinedRoomsRef.current.has(room._id)) {
                    console.log("Global Listener: Joining", room._id)
                    socket.emit("join-room", room._id)
                    joinedRoomsRef.current.add(room._id)
                }
            })

            const handleCall = (data: any) => {
                console.log("Global Listener: Call Received", data)
                // Only show if we aren't already negotiating in that room
                if (selectedRoom?._id !== data.roomId) {
                    // Find the room details again to ensure we have the full object if needed, 
                    // or just construct enough to engage
                    setIncomingCall({
                        roomId: data.roomId || data.roomId, // ensure we get it from event or logic
                        signal: data.signal,
                        from: data.from
                    })
                }
            }

            // We need to uniquely identify the room in the event if possible, 
            // but currently the server broadcasts to the *room*. 
            // So we need to rely on the socket event context if we can, or the event data.
            // Our server emits `call-received` to the room.
            // When we receive it, we need to know WHICH room it came from.
            // This is tricky with standard socket.io client if we don't pass roomId in the payload.
            // *Wait*, looking at server code: 
            // socket.to(data.roomId).emit("call-received", { signal: data.signalData, from: data.from });
            // It does NOT send the roomId back in the payload. 
            // FIX: We need to rely on the fact that if we receive it, it's for one of our rooms. 
            // But if we have 5 rooms, which one? use the 'from' (buyerId) to match.

            socket.off("call-received", handleCall) // Clean prev
            socket.on("call-received", (data) => {
                // We need to inject the roomId by inference or if we update server.
                // Inference: The room ID format is `negotiation:FARMER:BUYER`.
                // data.from is the Initiator ID (Buyer).
                if (data.from) {
                    const inferredRoomId = `negotiation:${farmerId}:${data.from}`
                    handleCall({ ...data, roomId: inferredRoomId })
                }
            })
        }

        if (rooms.length > 0) {
            attachListeners()
        }

        return () => clearInterval(interval)
    }, [rooms.length, farmerId, selectedRoom]) // Re-run when rooms change to join new ones

    const acceptCall = () => {
        if (!incomingCall) return

        // Find the room object
        const room = rooms.find(r => r._id === incomingCall.roomId) || { _id: incomingCall.roomId, lastMessage: "Incoming Call", lastTime: "Now" }

        setSelectedRoom(room)
        // We do NOT clear incomingCall yet, we pass it to NegotiationChat
        // NegotiationChat should clear it on mount/handle
    }

    if (loading) return null

    return (
        <div className="space-y-8 relative pt-12 mt-12 border-t border-zinc-100">
            {/* Global Incoming Call Overlay */}
            <AnimatePresence>
                {incomingCall && !selectedRoom && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-24 right-4 md:right-10 z-[200] bg-zinc-900 border border-zinc-700 p-4 rounded-3xl shadow-2xl w-auto max-w-sm flex items-center gap-4"
                    >
                        <div className="bg-green-500 p-3 rounded-full animate-bounce">
                            <PhoneIncoming size={24} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">Incoming Call</h4>
                            <p className="text-zinc-400 text-xs">Buyer is requesting audio...</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button
                                onClick={() => setIncomingCall(null)}
                                className="p-2 bg-red-500 hover:bg-red-600 rounded-xl transition-colors text-white"
                            >
                                <X size={18} />
                            </button>
                            <button
                                onClick={acceptCall}
                                className="p-2 bg-green-500 hover:bg-green-600 rounded-xl transition-colors text-white"
                            >
                                <Phone size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            {/* Call Indicator on Card */}
                            {incomingCall?.roomId === room._id && (
                                <div className="absolute inset-0 bg-zinc-900/90 z-10 flex flex-col items-center justify-center text-white">
                                    <PhoneIncoming className="animate-bounce mb-2 text-green-400" size={32} />
                                    <span className="font-bold">Incoming Call...</span>
                                </div>
                            )}

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
                        productId="bulk"
                        buyerId={selectedRoom._id.split(':').pop()}
                        farmerId={farmerId}
                        farmerName="Farmer"
                        buyerName={`Buyer #${selectedRoom._id.split(':').pop().slice(-4).toUpperCase()}`}
                        currentUserRole="farmer"
                        onClose={() => {
                            setSelectedRoom(null)
                            setIncomingCall(null) // Clear call state on close
                        }}
                        // Pass the signal down if we accepted a call for this room
                        {...(incomingCall?.roomId === selectedRoom._id ? {
                            initialIncomingCall: incomingCall?.signal
                        } : {})}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

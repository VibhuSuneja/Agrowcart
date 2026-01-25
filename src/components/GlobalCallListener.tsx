'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PhoneIncoming, X, Phone } from 'lucide-react'
import NegotiationChat from './NegotiationChat'
import { useSocket } from '@/context/SocketContext'

export default function GlobalCallListener({ userId, role }: { userId: string, role: string }) {
    const { incomingCall, clearCall } = useSocket()
    const [activeNegotiation, setActiveNegotiation] = useState<any>(null)

    const acceptCall = () => {
        if (!incomingCall) return

        // Extract IDs from roomId
        const parts = incomingCall.roomId.split(':')
        const farmerId = parts[1]
        const buyerId = parts[2]

        // Prepare info for the chat modal
        const roomInfo = {
            _id: incomingCall.roomId,
            farmerId,
            buyerId,
            farmerName: role === 'buyer' ? "Farmer" : "You",
            buyerName: role === 'farmer' ? "Buyer" : "You"
        }

        setActiveNegotiation(roomInfo)
    }

    return (
        <>
            <AnimatePresence>
                {incomingCall && !activeNegotiation && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] bg-zinc-900 border border-zinc-700 p-5 rounded-[2rem] shadow-3xl w-[90vw] max-w-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-green-500/20">
                                <PhoneIncoming size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm tracking-tight">Incoming Call</h4>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Negotiation Channel</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={clearCall}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={acceptCall}
                                className="p-3 bg-green-500 hover:bg-green-600 rounded-xl transition-all text-white shadow-lg shadow-green-500/40"
                            >
                                <Phone size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {activeNegotiation && (
                    <NegotiationChat
                        productId="bulk"
                        buyerId={activeNegotiation.buyerId}
                        farmerId={activeNegotiation.farmerId}
                        farmerName={activeNegotiation.farmerName}
                        buyerName={activeNegotiation.buyerName}
                        currentUserRole={role as any}
                        initialIncomingCall={incomingCall?.signal}
                        onClose={() => {
                            setActiveNegotiation(null)
                            clearCall() // Ensure context knows call is done
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

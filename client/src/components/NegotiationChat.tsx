'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Send, X, MessageSquare, Loader, Sparkle, User, UserCheck, Phone, PhoneIncoming } from 'lucide-react'
import axios from 'axios'
import VoiceCall from './VoiceCall'
import { useSocket } from '@/context/SocketContext'

interface IMessage {
    _id?: string
    roomId: string
    text: string
    senderId: string
    time: string
    createdAt?: Date
}

export default function NegotiationChat({
    productId,
    buyerId,
    farmerId,
    farmerName,
    buyerName = "Buyer",
    currentUserRole = "buyer",
    onClose,
    initialIncomingCall
}: {
    productId: string,
    buyerId: string,
    farmerId: string,
    farmerName: string,
    buyerName?: string,
    currentUserRole?: "buyer" | "farmer",
    onClose: () => void,
    initialIncomingCall?: any
}) {
    const { socket, isConnected } = useSocket()
    const currentUserId = String(currentUserRole === "buyer" ? buyerId : farmerId);
    const chatPartnerId = String(currentUserRole === "buyer" ? farmerId : buyerId);
    const chatTitle = currentUserRole === "buyer" ? farmerName : buyerName;

    const [messages, setMessages] = useState<IMessage[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isOtherTyping, setIsOtherTyping] = useState(false)
    const [isPartnerOnline, setIsPartnerOnline] = useState(false)
    const chatBoxRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastEmitRef = useRef<number>(0)

    // Ensure IDs are strings
    const fId = typeof farmerId === 'object' ? (farmerId as any).toString() : String(farmerId);
    const bId = typeof buyerId === 'object' ? (buyerId as any).toString() : String(buyerId);
    const roomId = `negotiation:${fId}:${bId}`

    // Call State
    const [isCalling, setIsCalling] = useState(false)
    const [receivingCall, setReceivingCall] = useState(false)
    const [incomingSignal, setIncomingSignal] = useState<any>(null)

    useEffect(() => {
        if (!socket) return

        console.log("NegotiationChat: Correct Logic Mounting", socket.id)
        socket.emit("join-room", roomId)

        // Handlers are defined inside to close over state if needed, 
        // or using ref-safe setters.
        const handleNewMessage = (msg: IMessage) => {
            if (msg.roomId === roomId) {
                setMessages((prev) => {
                    const isDuplicate = prev.some(p =>
                        (p._id && msg._id && p._id === msg._id) ||
                        (p.time === msg.time && p.text === msg.text && p.senderId === msg.senderId)
                    );
                    if (isDuplicate) return prev;

                    if (msg.senderId?.toString() !== currentUserId) {
                        // 1. Play Premium Chime
                        try {
                            const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3')
                            chime.volume = 0.3; // Distraction-free volume
                            chime.play().catch(() => { })
                        } catch (e) { }

                        // 2. Voice Synthesis
                        try {
                            const partnerName = currentUserRole === 'buyer' ? farmerName : buyerName;
                            const speech = new SpeechSynthesisUtterance(`Message from ${partnerName}`);
                            speech.rate = 1.1;
                            speech.pitch = 1.2;
                            window.speechSynthesis.speak(speech);
                        } catch (e) { }
                    }
                    return [...prev, msg]
                })
            }
        }

        const handleCallReceived = (data: any) => {
            if (!isCalling) {
                setReceivingCall(true)
                setIncomingSignal(data.signal)
            }
        }

        const handleTyping = (data: any) => {
            if (data.senderId !== currentUserId) setIsOtherTyping(true)
        }

        const handleStopTyping = (data: any) => {
            if (data.senderId !== currentUserId) setIsOtherTyping(false)
        }

        const handleStatusChange = (data: any) => {
            if (String(data.userId) === chatPartnerId) {
                setIsPartnerOnline(data.status === "online")
            }
        }

        // Listener Setup
        socket.on("send-message", handleNewMessage)
        socket.on("call-received", handleCallReceived)
        socket.on("typing", handleTyping)
        socket.on("stop-typing", handleStopTyping)
        socket.on("user-status-change", handleStatusChange)

        // Initial Status Check
        socket.emit("check-user-status", chatPartnerId, (res: any) => {
            setIsPartnerOnline(res.status === "online")
        })

        // Initial Fetch from DB
        const fetchMessages = async () => {
            try {
                const res = await axios.post('/api/chat/messages', { roomId })
                setMessages(res.data)
            } catch (error) {
                console.error("Error fetching messages", error)
            }
        }
        fetchMessages()

        return () => {
            console.log("NegotiationChat: Unmounting Clear")
            socket.off("send-message", handleNewMessage)
            socket.off("call-received", handleCallReceived)
            socket.off("typing", handleTyping)
            socket.off("stop-typing", handleStopTyping)
            socket.off("user-status-change", handleStatusChange)
        }
    }, [roomId, socket, chatPartnerId, currentUserId, isCalling])

    const handleSelfTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)
        if (!socket) return

        const now = Date.now()
        if (now - lastEmitRef.current > 1200) {
            socket.emit("typing", { roomId, senderId: currentUserId })
            lastEmitRef.current = now
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop-typing", { roomId, senderId: currentUserId })
        }, 2500)
    }

    useEffect(() => {
        if (initialIncomingCall) {
            setIncomingSignal(initialIncomingCall)
            setIsCalling(true)
            setReceivingCall(false)
        }
    }, [initialIncomingCall])

    useEffect(() => {
        chatBoxRef.current?.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages])

    const sendMsg = async () => {
        if (!newMessage.trim()) return

        const messagePayload = {
            roomId,
            text: newMessage,
            senderId: currentUserId,
            senderName: currentUserRole === "buyer" ? buyerName : farmerName,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }

        // 1. Optimistic UI
        const tempId = Math.random().toString(36).substr(2, 9);
        const optimisticMsg = { ...messagePayload, _id: tempId };
        setMessages((prev) => [...prev, optimisticMsg])
        setNewMessage("")

        try {
            // 2. Correct Logic Pattern: Socket Emit + API Save
            socket?.emit("send-message", messagePayload)
            await axios.post('/api/chat/send', messagePayload)
        } catch (error) {
            console.error("Persistence failed, but message was emitted", error)
        }
    }

    const getAiSuggestions = async () => {
        setLoading(true)
        try {
            const lastMsg = messages.filter(m => m.senderId?.toString() !== currentUserId).at(-1)
            const res = await axios.post("/api/chat/ai-suggestions", {
                message: lastMsg?.text || "Started a new negotiation for bulk ordering.",
                role: currentUserRole
            })
            setSuggestions(res.data)
        } catch (error) {
            console.error("AI Suggestions error", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCallEnd = React.useCallback(() => {
        setIsCalling(false)
        setIncomingSignal(null)
        setReceivingCall(false)
    }, []);

    const startCall = React.useCallback(() => setIsCalling(true), []);
    const answerCall = React.useCallback(() => {
        setReceivingCall(false)
        setIsCalling(true)
    }, []);

    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    const content = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-md"
            onClick={onClose}
        >
            <AnimatePresence>
                {receivingCall && !isCalling && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="absolute top-10 left-4 right-4 md:left-0 md:right-0 mx-auto w-auto max-w-sm md:w-80 bg-zinc-900 text-white p-4 rounded-3xl shadow-2xl z-[400] flex items-center justify-between border border-zinc-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-500 rounded-full animate-bounce">
                                <PhoneIncoming size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Incoming Call...</h4>
                                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Audio Request</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setReceivingCall(false)} className="p-2 bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                                <X size={18} />
                            </button>
                            <button onClick={answerCall} className="p-2 bg-green-500 rounded-xl hover:bg-green-600 transition-colors">
                                <Phone size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-white w-full h-[100dvh] md:h-[650px] md:max-w-lg md:rounded-[3rem] shadow-3xl overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <AnimatePresence>
                    {isCalling && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-zinc-900"
                        >
                            <VoiceCall
                                roomId={roomId}
                                userId={currentUserId}
                                otherUserId={chatPartnerId}
                                isInitiator={!receivingCall && !incomingSignal}
                                incomingSignal={incomingSignal}
                                onEnd={handleCallEnd}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Header - Stays above Call Overlay */}
                <div className="relative z-[60] bg-zinc-900 p-4 md:p-8 text-white flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5">
                                <UserCheck className="text-green-400" size={20} />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 ${isPartnerOnline ? 'bg-green-500' : 'bg-zinc-600'}`} />
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-black tracking-tight">{chatTitle}</h3>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    {isPartnerOnline ? 'Online Now' : 'Last seen recently'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={startCall}
                            className="p-2.5 md:p-3 bg-green-600 hover:bg-green-500 rounded-xl transition-colors shadow-lg shadow-green-900/40"
                            title="Start Call"
                        >
                            <Phone size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="p-2.5 md:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-zinc-50/50" ref={chatBoxRef}>
                    {messages.length === 0 && (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <MessageSquare className="text-zinc-200" size={32} />
                            </div>
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Start negotiating for bulk rates</p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: msg.senderId?.toString() === currentUserId ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.senderId?.toString() === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.senderId?.toString() === currentUserId
                                ? "bg-zinc-900 text-white rounded-br-none"
                                : "bg-white text-zinc-800 border border-zinc-100 rounded-bl-none"
                                }`}>
                                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                <span className="text-[9px] opacity-50 block mt-2 text-right font-black uppercase">{msg.time}</span>
                            </div>
                        </motion.div>
                    ))}

                    {isOtherTyping && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white px-4 py-2 rounded-2xl border border-zinc-100 italic text-[10px] text-zinc-400 font-bold flex items-center gap-2 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" />
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                                {chatTitle} is typing...
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="px-4 md:px-8 pb-3 md:pb-4 bg-zinc-50/50">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">AI Negotiation Expert</span>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={getAiSuggestions}
                            disabled={loading}
                            className="text-[9px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 border border-green-200"
                        >
                            <Sparkle size={10} />
                            {loading ? "Thinking..." : "Get Advise"}
                        </motion.button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setNewMessage(s)}
                                className="whitespace-nowrap px-3 md:px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] md:text-xs font-bold text-zinc-600 hover:border-green-500 hover:text-green-600 transition-all shadow-sm"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 md:p-8 bg-white border-t border-zinc-100">
                    <div className="flex gap-3 md:gap-4">
                        <input
                            type="text"
                            placeholder="Propose a rate..."
                            className="flex-1 bg-zinc-50 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 border border-zinc-100 font-bold text-sm transition-all"
                            value={newMessage}
                            onChange={handleSelfTyping}
                            onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={sendMsg}
                            className="bg-green-600 text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl shadow-green-600/20 hover:bg-green-700 transition-colors"
                        >
                            <Send size={20} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );

    if (!mounted) return null;
    return require('react-dom').createPortal(content, document.body)
}

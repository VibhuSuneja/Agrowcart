'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
    incomingCall: { roomId: string, signal: any, from: string } | null
    answerCall: () => void
    clearCall: () => void
    joinRoom: (roomId: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
    const context = useContext(SocketContext)
    // During SSR, LazySocketProvider doesn't render SocketProvider, so context will be undefined.
    // Instead of throwing and causing a 500 error, we return a safe mock or handle it in the component.
    if (!context) {
        // Return a mock object that matches the interface but does nothing
        return {
            socket: null,
            isConnected: false,
            incomingCall: null,
            answerCall: () => { },
            clearCall: () => { },
            joinRoom: () => { }
        }
    }
    return context
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession()
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [incomingCall, setIncomingCall] = useState<{ roomId: string, signal: any, from: string } | null>(null)
    const joinedRoomsRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        // Initialize Socket
        let socketUrl = "http://localhost:4000";
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            const protocol = window.location.protocol === "https:" ? "https" : "http";
            socketUrl = `${protocol}://${hostname}${window.location.protocol === "https:" ? "" : ":4000"}`;
        }

        if (!session?.user?.id) return

        console.log("🔌 SocketProvider: Initializing connection to", socketUrl)

        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || socketUrl, {
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            transports: ['websocket'],
            forceNew: false
        })

        socketInstance.on("connect", () => {
            console.log("🟢 SocketProvider: Connected", socketInstance.id)
            setIsConnected(true)

            // Correct Logic: Identity Handshake
            if (session?.user?.id) {
                console.log("SocketProvider: Establishing Identity for", session.user.id)
                socketInstance.emit("identity", session.user.id)

                // Also join user specific room for legacy compatibility
                socketInstance.emit("join-room", `user:${session.user.id}`)

                // Re-join other rooms if needed
                joinedRoomsRef.current.forEach(room => {
                    socketInstance.emit("join-room", room)
                })

                // Join Admin room if role is admin
                if (session.user.role === 'admin') {
                    console.log("SocketProvider: Admin Room Joined")
                    socketInstance.emit("join-room", "admin")
                }
            }
        })

        socketInstance.on("disconnect", () => {
            console.warn("🟡 SocketProvider: Disconnected")
            setIsConnected(false)
        })

        // Order Notification Listener (Admin Only)
        socketInstance.on("new-order", (newOrder) => {
            if (session?.user?.role === 'admin') {
                console.log("📦 SocketProvider: Global Order Notification", newOrder)
                // 1. Play Order Chime
                try {
                    const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
                    chime.volume = 0.5;
                    chime.play().catch(() => { });
                } catch (e) { }

                // 2. Beautiful Success Toast
                toast.success(`New order received from ${newOrder.address?.fullName || 'Customer'}!`, {
                    icon: '🛍️',
                    duration: 6000,
                    position: 'top-right'
                })

                // 3. TTS Announcement
                try {
                    if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(`New order from ${newOrder.address?.fullName || 'customer'}`)
                        window.speechSynthesis.speak(utterance)
                    }
                } catch (e) { }
            }
        })

        // Global Listeners
        socketInstance.on("incoming-call-alert", (data) => {
            console.log("🔔 SocketProvider: Global Call Alert Received", data)
            // 1. Play Bell/Ringtone
            try {
                const ringtone = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3') // Elegant bell song
                ringtone.volume = 0.3; // Audible but subtle
                ringtone.play().catch(() => { });
            } catch (e) { }

            // 2. Voice Synthesis
            try {
                const speech = new SpeechSynthesisUtterance("Incoming Negotiation Call");
                speech.rate = 1.0;
                speech.pitch = 1.0;
                window.speechSynthesis.speak(speech);
            } catch (e) { }

            setIncomingCall(data)
        })

        socketInstance.on("new-message-notification", (data) => {
            // Only show toast if we are NOT the sender
            if (session?.user?.id && data.senderId !== session.user.id) {
                console.log("💬 SocketProvider: New Message Alert", data)

                // 1. Play Chime
                try {
                    const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3')
                    chime.volume = 0.3; // Distraction-free volume
                    chime.play().catch(() => { });
                } catch (e) { }

                // 2. Beautiful Toast
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-[2rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-8 border-green-600 overflow-hidden`}>
                        <div className="flex-1 w-0 p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-green-400">
                                        <MessageSquare size={20} />
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-black text-zinc-900">Message from {data.senderName || 'Partner'}</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-500 line-clamp-1 italic">"{data.text}"</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-zinc-100 bg-zinc-50/50">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-black text-zinc-400 hover:text-red-500 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ), { duration: 5000 });

                // 3. Voice Synthesis
                try {
                    const speech = new SpeechSynthesisUtterance(`Message from ${data.senderName || 'Partner'}`);
                    speech.rate = 1.1;
                    speech.pitch = 1.2;
                    window.speechSynthesis.speak(speech);
                } catch (e) { }
            }
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [session?.user?.id])

    const joinRoom = (roomId: string) => {
        if (!joinedRoomsRef.current.has(roomId)) {
            console.log("SocketProvider: Queuing/Joining Room", roomId)
            joinedRoomsRef.current.add(roomId)
            if (socket) {
                socket.emit("join-room", roomId)
            }
        }
    }

    const answerCall = () => {
        // Logic handled by components consuming the state
        console.log("SocketProvider: Call Answered Action Triggered")
    }

    const clearCall = () => {
        setIncomingCall(null)
    }

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            incomingCall,
            answerCall,
            clearCall,
            joinRoom
        }}>
            {children}
        </SocketContext.Provider>
    )
}

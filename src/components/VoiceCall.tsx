'use client'
import React, { useEffect, useRef, useState } from 'react'
import Peer from 'simple-peer'
import { Mic, MicOff, PhoneOff, Phone, Volume2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Buffer } from 'buffer'
import { useSocket } from '@/context/SocketContext'

if (typeof window !== 'undefined') {
    (window as any).Buffer = Buffer
}

interface VoiceCallProps {
    roomId: string
    userId: string      // "Me"
    otherUserId: string // "Them"
    isInitiator: boolean
    incomingSignal?: any
    onEnd: () => void
}

export default function VoiceCall({ roomId, userId, otherUserId, isInitiator, incomingSignal, onEnd }: VoiceCallProps) {
    const { socket } = useSocket()
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [callAccepted, setCallAccepted] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [status, setStatus] = useState(isInitiator ? "Calling..." : "Connecting...")
    const [isRemoteStreaming, setIsRemoteStreaming] = useState(false)

    const myAudioRef = useRef<HTMLAudioElement>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)
    const connectionRef = useRef<Peer.Instance | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!socket) return
        let isCancelled = false;

        const startMedia = async () => {
            try {
                console.log("VoiceCall: Requesting media...")
                const currentStream = await navigator.mediaDevices.getUserMedia({
                    audio: { echoCancellation: true, noiseSuppression: true }
                });

                if (isCancelled) {
                    currentStream.getTracks().forEach(t => t.stop());
                    return;
                }

                setStream(currentStream)
                if (myAudioRef.current) myAudioRef.current.srcObject = currentStream

                const peer = new Peer({
                    initiator: isInitiator,
                    trickle: false,
                    stream: currentStream,
                    config: {
                        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }]
                    }
                })

                connectionRef.current = peer

                peer.on('signal', (data: any) => {
                    console.log(`📡 VoiceCall: Signal [${data.type}]`)
                    if (isInitiator) {
                        socket.emit('call-user', { userToCall: String(otherUserId), signalData: data, from: String(userId), roomId })
                    } else {
                        socket.emit('answer-call', { signal: data, roomId })
                    }
                })

                peer.on('stream', (remoteStream: MediaStream) => {
                    console.log("🔊 VoiceCall: Remote Audio Stream Received");
                    setIsRemoteStreaming(true)
                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = remoteStream;
                        remoteAudioRef.current.play().catch(e => {
                            console.warn("⚠️ Autoplay block", e);
                            setStatus("Click to Play Audio");
                        });
                    }
                })

                peer.on('connect', () => {
                    console.log("VoiceCall: Peer Connected");
                    setStatus("Connected")
                    setCallAccepted(true)
                    if (timeoutRef.current) clearTimeout(timeoutRef.current)
                })

                peer.on('error', (err: any) => {
                    console.error("VoiceCall: Peer Error:", err);
                    setStatus("Connection Failed")
                })

                // Listeners setup
                const handleCallAccepted = (signal: any) => {
                    console.log("⚡ VoiceCall: Handshake Finalized")
                    if (!peer.destroyed) peer.signal(signal)
                }

                const handleEndCall = () => {
                    console.log("VoiceCall: Remote Ended");
                    onEnd();
                }

                if (isInitiator) {
                    socket.on('call-accepted', handleCallAccepted)
                    // Timeout if no answer in 30s
                    timeoutRef.current = setTimeout(() => {
                        if (!callAccepted) {
                            toast.error("No answer");
                            onEnd();
                        }
                    }, 30000);
                } else if (incomingSignal) {
                    peer.signal(incomingSignal)
                }

                socket.on('end-call', handleEndCall);

                // Store for cleanup
                (peer as any)._cleanup = () => {
                    socket.off('call-accepted', handleCallAccepted);
                    socket.off('end-call', handleEndCall);
                };

            } catch (err) {
                console.error("Media Error:", err)
                setStatus("Mic Permission Required")
            }
        };

        startMedia();

        return () => {
            isCancelled = true;
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            if (connectionRef.current) {
                const p = connectionRef.current as any;
                if (p._cleanup) p._cleanup();
                connectionRef.current.destroy();
            }
            stream?.getTracks().forEach(track => track.stop());
        }
    }, [socket, isInitiator, roomId, userId, otherUserId]); // Stability achieved. incomingSignal and onEnd removed from deps as they are used via initial/ref.

    const stopCall = () => {
        socket?.emit('end-call', { roomId });
        onEnd();
    }

    const toggleMute = () => {
        if (stream) {
            const track = stream.getAudioTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsMuted(!track.enabled);
                toast.success(track.enabled ? "Mic On" : "Mic Muted");
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 text-white rounded-[2rem] h-full w-full relative overflow-hidden">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${isRemoteStreaming ? 'bg-green-500/20' : 'bg-red-500/10'} rounded-full blur-[100px] animate-pulse`} />

            <div className="relative z-10 text-center space-y-8 w-full">
                <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center mx-auto border-4 border-zinc-700 shadow-2xl relative">
                    <Phone size={48} className={isRemoteStreaming ? "text-green-500" : "text-zinc-500"} />
                    {callAccepted && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-2.5 rounded-full border-4 border-zinc-900">
                            <Volume2 size={16} className="text-white animate-bounce" />
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="text-2xl font-black">{status}</h3>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                        {isInitiator ? "Negotiation Call" : "Partner Calling..."}
                    </p>
                </div>

                {status === "Click to Play Audio" && (
                    <button onClick={() => remoteAudioRef.current?.play()} className="bg-green-600 px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">
                        Hear Audio
                    </button>
                )}

                <audio ref={myAudioRef} autoPlay muted className="hidden" />
                <audio ref={remoteAudioRef} autoPlay className="hidden" />

                <div className="flex items-center gap-4 justify-center pt-4">
                    <button onClick={toggleMute} className={`p-5 rounded-2xl transition-all ${isMuted ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}>
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button onClick={stopCall} className="p-5 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20">
                        <PhoneOff size={28} />
                    </button>
                </div>
            </div>
        </div>
    )
}

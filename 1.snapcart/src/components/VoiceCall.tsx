'use client'
import React, { useEffect, useRef, useState } from 'react'
import Peer from 'simple-peer'
import { getSocket } from '@/lib/socket'
import { Mic, MicOff, PhoneOff, Phone, Volume2, Wifi, WifiOff } from 'lucide-react'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'

interface VoiceCallProps {
    roomId: string
    userId: string      // "Me"
    otherUserId: string // "Them"
    isInitiator: boolean
    incomingSignal?: any
    onEnd: () => void
}

export default function VoiceCall({ roomId, userId, otherUserId, isInitiator, incomingSignal, onEnd }: VoiceCallProps) {
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [callAccepted, setCallAccepted] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [status, setStatus] = useState(isInitiator ? "Calling..." : "Connecting...")
    const [isRemoteStreaming, setIsRemoteStreaming] = useState(false)

    const myAudioRef = useRef<HTMLAudioElement>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)
    const connectionRef = useRef<Peer.Instance | null>(null)
    const socket = getSocket()

    useEffect(() => {
        let isCancelled = false;

        const startMedia = async () => {
            try {
                console.log("VoiceCall: Requesting media access...")
                const currentStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });

                if (isCancelled) {
                    currentStream.getTracks().forEach(t => t.stop());
                    return;
                }

                console.log("VoiceCall: Media access granted")
                setStream(currentStream)
                if (myAudioRef.current) {
                    myAudioRef.current.srcObject = currentStream
                }

                const peer = new Peer({
                    initiator: isInitiator,
                    trickle: false,
                    stream: currentStream,
                    config: {
                        iceServers: [
                            { urls: 'stun:stun.l.google.com:19302' },
                            { urls: 'stun:stun1.l.google.com:19302' }
                        ]
                    }
                })

                peer.on('signal', (data: any) => {
                    console.log("VoiceCall: Generated signal data", isInitiator ? "Initiator" : "Receiver")
                    if (isInitiator) {
                        socket.emit('call-user', { userToCall: otherUserId, signalData: data, from: userId, roomId })
                    } else {
                        socket.emit('answer-call', { signal: data, to: otherUserId, from: userId, roomId })
                    }
                })

                peer.on('stream', (remoteStream: MediaStream) => {
                    console.log("VoiceCall: Remote stream received");
                    setIsRemoteStreaming(true)
                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = remoteStream;
                        remoteAudioRef.current.play().catch(e => {
                            console.warn("Autoplay block", e);
                            setStatus("Click to Play Audio");
                        });
                    }
                })

                peer.on('connect', () => {
                    console.log("VoiceCall: Peer Connected");
                    setStatus("Connected")
                    setCallAccepted(true)
                })

                peer.on('error', (err: any) => {
                    console.error("VoiceCall: Peer Error:", err);
                    setStatus("Connection Failed")
                })

                connectionRef.current = peer

                if (isInitiator) {
                    socket.on('call-accepted', (signal: any) => {
                        console.log("VoiceCall: Call Accepted signal received")
                        setCallAccepted(true)
                        if (peer && !peer.destroyed) peer.signal(signal)
                    })
                } else if (incomingSignal) {
                    console.log("VoiceCall: Processing incoming signal")
                    peer.signal(incomingSignal)
                }

                socket.on('end-call', () => {
                    console.log("VoiceCall: Call ended by remote");
                    onEnd();
                });

            } catch (err) {
                console.error("Media Error:", err)
                setStatus("Check Microphone Permissions")
            }
        };

        startMedia();

        return () => {
            isCancelled = true;
            if (connectionRef.current) {
                connectionRef.current.destroy();
            }
            socket.off('call-accepted');
            socket.off('end-call');
            stream?.getTracks().forEach(track => track.stop());
        }
    }, [])

    const stopCall = () => {
        socket.emit('end-call', { roomId });
        if (connectionRef.current) connectionRef.current.destroy();
        stream?.getTracks().forEach(track => track.stop());
        onEnd();
    }

    const toggleMute = () => {
        if (stream) {
            const track = stream.getAudioTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsMuted(!track.enabled);
                toast.success(track.enabled ? "Mic Active" : "Mic Muted");
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 text-white rounded-[2rem] h-full w-full relative overflow-hidden">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${isRemoteStreaming ? 'bg-green-500/20' : 'bg-red-500/10'} rounded-full blur-[100px] animate-pulse`} />

            <div className="relative z-10 text-center space-y-8 w-full">
                <div className="relative">
                    <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center mx-auto border-4 border-zinc-700 shadow-2xl">
                        <Phone size={48} className={isRemoteStreaming ? "text-green-500" : "text-zinc-500"} />
                    </div>
                    {callAccepted && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-3 rounded-full border-4 border-zinc-900 shadow-xl">
                            <Volume2 size={20} className="text-white animate-bounce" />
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="text-2xl font-black">{status}</h3>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        {isInitiator ? "Outgoing Negotiation Call" : "Incoming Negotiation Call"}
                    </p>
                </div>

                {status === "Click to Play Audio" && (
                    <button
                        onClick={() => remoteAudioRef.current?.play()}
                        className="bg-green-600 px-6 py-2 rounded-xl font-bold text-xs"
                    >
                        Activate Audio
                    </button>
                )}

                <audio ref={myAudioRef} autoPlay muted className="hidden" />
                <audio ref={remoteAudioRef} autoPlay className="hidden" />

                <div className="flex items-center gap-4 justify-center pt-4">
                    <button
                        onClick={toggleMute}
                        className={`p-5 rounded-2xl transition-all ${isMuted ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                        onClick={stopCall}
                        className="p-5 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-xl"
                    >
                        <PhoneOff size={28} />
                    </button>
                </div>
            </div>
        </div>
    )
}

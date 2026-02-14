'use client'
import React, { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface VoiceAssistantProps {
    onCommand: (command: string) => void
}

export default function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [recognition, setRecognition] = useState<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const reco = new SpeechRecognition()
                reco.continuous = false
                reco.interimResults = true
                reco.lang = 'en-US'

                reco.onstart = () => setIsListening(true)
                reco.onend = () => setIsListening(false)
                reco.onresult = (event: any) => {
                    const current = event.resultIndex
                    const transcriptText = event.results[current][0].transcript
                    setTranscript(transcriptText)
                    if (event.results[current].isFinal) {
                        onCommand(transcriptText.toLowerCase())
                        setTimeout(() => setTranscript(""), 2000)
                    }
                }
                setRecognition(reco)
            }
        }
    }, [onCommand])

    const toggleListening = () => {
        if (!recognition) {
            alert("Voice recognition not supported in this browser.")
            return
        }
        if (isListening) {
            recognition.stop()
        } else {
            recognition.start()
        }
    }

    return (
        <div className="fixed bottom-28 md:bottom-6 left-6 z-[9999]">
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8, x: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        className="absolute bottom-20 left-0 bg-zinc-900/90 backdrop-blur-md text-white p-4 rounded-2xl w-64 mb-2 shadow-2xl border border-white/10 origin-bottom-left"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-green-400 animate-pulse">Listening...</span>
                        </div>
                        <p className="font-medium text-lg leading-tight break-words">
                            {transcript || "Try 'List Harvest'..."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleListening}
                aria-label={isListening ? "Stop voice assistant" : "Start voice assistant"}
                className={`p-4 md:p-5 rounded-full shadow-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-red-500/40 animate-pulse' : 'bg-white text-zinc-900 shadow-zinc-900/10 border-4 border-zinc-100 hover:border-green-400'}`}
                title="Voice Assistant"
            >
                {isListening ? <MicOff size={24} /> : <div className="relative"><Mic size={24} /><span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span></div>}
            </motion.button>
        </div>
    )
}

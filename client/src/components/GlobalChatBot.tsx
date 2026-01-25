'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, Send, X, Bot, User, Sparkles, MinusCircle, Loader, Paperclip, Volume2, FileIcon, Mic } from 'lucide-react'
import axios from 'axios'
import { cn } from '@/lib/utils'

interface IChatMessage {
    id: string
    role: 'user' | 'bot'
    text: string
    time: string
}

function GlobalChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<IChatMessage[]>([
        {
            id: '1',
            role: 'bot',
            text: 'Hello! I am your SnapCart Assistant. How can I help you today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.")
            return
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.lang = 'en-US' // Default, can be tuned to user lang
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onerror = () => setIsListening(false)

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInput(prev => (prev ? prev + " " + transcript : transcript))
        }

        recognition.start()
    }

    const speak = (text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)

            // Reusing the language detection logic for inclusivity
            const cookieValue = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1]
            const lang = cookieValue?.split('/').pop() || 'en'
            const mapping: { [key: string]: string } = { 'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'kn': 'kn-IN', 'mr': 'mr-IN', 'pa': 'pa-IN', 'gu': 'gu-IN', 'bn': 'bn-IN' }
            utterance.lang = mapping[lang] || 'en-US'

            window.speechSynthesis.speak(utterance)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const userMsg: IChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: `Uploaded file: ${file.name}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, userMsg])
        setLoading(true)

        // Simulated AI analysis of file context
        setTimeout(() => {
            const botMsg: IChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: `I've received your file "${file.name}". I'm analyzing its content for agricultural relevance. Is there anything specific you'd like me to look for?`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, botMsg])
            setLoading(false)
        }, 1500)
    }

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim()) return

        const userMsg: IChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setLoading(true)

        try {
            const res = await axios.post('/api/ai/chatbot', { message: input })
            const botMsg: IChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: res.data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            console.error(error)
            const errorMsg: IChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: "I'm having trouble connecting to the network instantly. Please try again.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[90vw] md:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-green-600 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Bot size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">SnapCart AI</h3>
                                    <div className="flex items-center gap-1.5 opacity-80">
                                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <MinusCircle size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 scrollbar-thin scrollbar-thumb-zinc-200">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                        msg.role === 'bot' ? "bg-green-100 text-green-600" : "bg-zinc-200 text-zinc-600"
                                    )}>
                                        {msg.role === 'bot' ? <Sparkles size={14} /> : <User size={14} />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm shadow-sm relative group/msg",
                                        msg.role === 'bot' ? "bg-white text-zinc-800 rounded-tl-none border border-zinc-100" : "bg-green-600 text-white rounded-tr-none"
                                    )}>
                                        {msg.text.startsWith('Uploaded file:') && (
                                            <div className="flex items-center gap-2 mb-2 p-2 bg-black/5 rounded-lg">
                                                <FileIcon size={16} className="text-green-600" />
                                                <span className="text-[10px] font-bold">Document</span>
                                            </div>
                                        )}
                                        <p className="leading-relaxed">{msg.text}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className={cn(
                                                "text-[9px] font-bold opacity-50",
                                                msg.role === 'bot' ? "text-zinc-400" : "text-green-100"
                                            )}>{msg.time}</p>

                                            {msg.role === 'bot' && (
                                                <button
                                                    onClick={() => speak(msg.text)}
                                                    className="opacity-0 group-hover/msg:opacity-100 p-1 hover:bg-zinc-100 rounded-md transition-all"
                                                    title="Speak response"
                                                >
                                                    <Volume2 size={12} className="text-green-600" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                        <Loader size={14} className="animate-spin" />
                                    </div>
                                    <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none text-zinc-400 text-xs font-bold italic">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-zinc-100 flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 bg-zinc-100 text-zinc-500 rounded-xl hover:bg-zinc-200 transition-colors"
                                title="Upload File"
                            >
                                <Paperclip size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={startListening}
                                className={cn(
                                    "p-3 rounded-xl transition-all shadow-sm",
                                    isListening ? "bg-red-100 text-red-600 animate-pulse ring-2 ring-red-500/20" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                )}
                                title="Voice to Text"
                            >
                                <Mic size={18} />
                            </button>
                            <input
                                type="text"
                                placeholder={isListening ? "Listening..." : "Ask about products, orders..."}
                                className="flex-1 bg-zinc-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-green-500/20 text-zinc-800 placeholder:text-zinc-400"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-green-600 text-white p-4 md:p-5 rounded-full shadow-2xl shadow-green-900/40 border-4 border-white flex items-center justify-center"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    )
}

export default GlobalChatBot

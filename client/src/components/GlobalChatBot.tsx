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
            text: 'Hello! I am your Agrowcart Assistant. How can I help you today?',
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
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
                        className="absolute bottom-20 right-0 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col overflow-hidden rounded-[2.5rem] glass-panel border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl"
                    >
                        {/* Premium Header */}
                        <div className="sidebar-gradient p-6 flex items-center justify-between text-white relative overflow-hidden">
                            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-white/10 blur-[100px] rounded-full"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                                    <Bot size={28} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg tracking-tight">Agrow Assistant</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex">
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping absolute"></span>
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full relative"></span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-200/80">Active AI</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-all group">
                                <X size={20} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/5 dark:bg-black/20 scrollbar-hide">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={msg.id}
                                    className={cn(
                                        "flex gap-4 max-w-[90%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg border",
                                        msg.role === 'bot'
                                            ? "bg-primary/20 text-primary border-primary/20"
                                            : "bg-gold-harvest/20 text-gold-harvest border-gold-harvest/20"
                                    )}>
                                        {msg.role === 'bot' ? <Sparkles size={16} /> : <User size={16} />}
                                    </div>
                                    <div className={cn(
                                        "p-4 rounded-[1.5rem] text-sm shadow-xl relative group/msg backdrop-blur-sm border",
                                        msg.role === 'bot'
                                            ? "bg-white/80 dark:bg-surface-dark/80 text-zinc-800 dark:text-zinc-100 rounded-tl-none border-white/50 dark:border-white/5"
                                            : "bg-primary text-white rounded-tr-none border-primary/20"
                                    )}>
                                        {msg.text.startsWith('Uploaded file:') && (
                                            <div className="flex items-center gap-3 mb-3 p-3 bg-black/5 dark:bg-white/10 rounded-xl border border-white/10">
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <FileIcon size={16} className="text-white" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Attachment Received</span>
                                            </div>
                                        )}
                                        <p className="leading-relaxed font-medium">{msg.text}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <p className={cn(
                                                "text-[9px] font-black uppercase tracking-widest opacity-60",
                                                msg.role === 'bot' ? "text-zinc-400" : "text-emerald-100"
                                            )}>{msg.time}</p>

                                            {msg.role === 'bot' && (
                                                <button
                                                    onClick={() => speak(msg.text)}
                                                    className="p-1.5 hover:bg-zinc-100/50 dark:hover:bg-white/10 rounded-lg transition-all"
                                                    title="Listen to AI"
                                                >
                                                    <Volume2 size={12} className="text-primary" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                    </div>
                                    <div className="bg-white/40 dark:bg-white/5 p-4 rounded-[1.5rem] rounded-tl-none text-zinc-400 text-xs font-black uppercase tracking-widest backdrop-blur-sm border border-white/20">
                                        AI is thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Section */}
                        <div className="p-6 bg-white/10 dark:bg-black/40 backdrop-blur-xl border-t border-white/10">
                            <form onSubmit={handleSend} className="flex gap-3 relative">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-12 h-12 bg-white/5 dark:bg-white/5 hover:bg-white/10 text-zinc-500 rounded-2xl flex items-center justify-center transition-all border border-white/10"
                                        title="Attach Resource"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={startListening}
                                        className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-lg",
                                            isListening
                                                ? "bg-red-500 text-white animate-pulse border-red-400 ring-4 ring-red-500/20"
                                                : "bg-white/5 dark:bg-white/5 text-zinc-500 hover:bg-white/10 border-white/10"
                                        )}
                                        title="Voice Command"
                                    >
                                        <Mic size={20} />
                                    </button>
                                </div>
                                <div className="flex-1 relative group">
                                    <input
                                        type="text"
                                        placeholder={isListening ? "Listening natively..." : "Type your query..."}
                                        className="w-full h-12 bg-white/10 dark:bg-white/5 rounded-2xl px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-white placeholder:text-zinc-500 border border-white/10 dark:border-white/5 transition-all"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || loading}
                                        className="absolute right-2 top-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-primary/30"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </form>
                            <div className="text-center mt-4">
                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Agrowcart Omni-Channel AI Hub</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-primary text-white rounded-[1.8rem] shadow-[0_10px_30px_rgba(6,96,70,0.4)] flex items-center justify-center relative group overflow-hidden border-2 border-white/20"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                {isOpen ? <X size={32} className="relative z-10" /> : <MessageCircle size={32} className="relative z-10" />}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-gold-harvest rounded-full border-2 border-white animate-bounce"></span>
                )}
            </motion.button>
        </div>
    )
}

export default GlobalChatBot

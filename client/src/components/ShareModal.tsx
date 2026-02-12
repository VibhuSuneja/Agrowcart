'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Copy, Share2, Mail, MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    url: string
    title: string
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-[#25D366]',
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`, '_blank')
        },
        {
            name: 'Gmail',
            icon: Mail,
            color: 'bg-[#EA4335]',
            action: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, '_blank')
        },
        {
            name: 'Telegram',
            icon: Send,
            color: 'bg-[#0088cc]',
            action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        },
        {
            name: 'Copy Link',
            icon: Copy,
            color: 'bg-zinc-800',
            action: () => {
                navigator.clipboard.writeText(url)
                toast.success('Link copied to clipboard!')
                onClose()
            }
        }
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                    <Share2 size={20} />
                                </div>
                                <h3 className="text-xl font-black text-zinc-900 tracking-tight">Share Product</h3>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close share modal"
                                className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {shareOptions.map((option) => (
                                <button
                                    key={option.name}
                                    onClick={option.action}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-all group"
                                >
                                    <div className={`w-10 h-10 ${option.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                                        <option.icon size={20} />
                                    </div>
                                    <span className="font-bold text-zinc-700 text-sm">{option.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-zinc-50 rounded-2xl p-4 flex items-center gap-3 border border-zinc-100">
                            <p className="flex-1 text-xs font-medium text-zinc-400 truncate">{url}</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(url)
                                    toast.success('Link copied!')
                                }}
                                className="text-xs font-black text-green-600 uppercase tracking-widest px-3 py-1 bg-white rounded-lg shadow-sm border border-zinc-100 hover:bg-green-50 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { MessageSquare, Send, Star, User } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface FeedbackSectionProps {
    onReviewSubmitted?: () => void
}

function FeedbackSection({ onReviewSubmitted }: FeedbackSectionProps) {
    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error("Please provide a rating!")
            return
        }
        setLoading(true)
        try {
            await axios.post("/api/reviews/add", {
                rating,
                feedback,
                email
            })
            toast.success("Thank you for your valuable feedback!")
            setRating(0)
            setFeedback("")
            setEmail("")
            // Trigger refresh in parent
            if (onReviewSubmitted) onReviewSubmitted()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="w-[95%] md:w-[85%] mx-auto mt-32 mb-20">
            <div className="bg-linear-to-br from-zinc-900 to-zinc-800 rounded-[3rem] p-8 md:p-16 overflow-hidden relative border border-white/5">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                            <MessageSquare className="text-green-400" size={18} />
                            <span className="text-green-400 text-xs font-black uppercase tracking-wider">Voice of the People</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                            Your Feedback <span className="text-green-400">Drives</span> Our Innovation.
                        </h2>

                        <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                            Help us refine the millet value chain from Kurukshetra to the world. Tell us about your experience or suggest new features to empower farmers.
                        </p>

                        <div className="flex gap-4">
                            <div className="bg-zinc-800/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-w-[100px]">
                                <span className="text-white font-black text-2xl">4.9/5</span>
                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Average Satisfaction</span>
                            </div>
                            <div className="bg-zinc-800/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-w-[100px]">
                                <span className="text-white font-black text-2xl">2k+</span>
                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Total Stories</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-zinc-300 text-sm font-bold block ml-1">Overall Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            suppressHydrationWarning
                                            onClick={() => setRating(star)}
                                            className="transition-all duration-300 transform hover:scale-125"
                                        >
                                            <Star
                                                size={32}
                                                className={star <= rating ? "text-yellow-400 fill-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]" : "text-zinc-600"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address (Optional)"
                                    className="w-full bg-zinc-900 shadow-inner border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none transition-all text-sm font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <textarea
                                    rows={4}
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full bg-zinc-900 shadow-inner border border-zinc-700 rounded-2xl py-4 px-4 text-white placeholder:text-zinc-600 focus:border-green-500 focus:outline-none transition-all text-sm font-medium resize-none"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                suppressHydrationWarning
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-all active:shadow-none"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Submit Feedback</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeedbackSection

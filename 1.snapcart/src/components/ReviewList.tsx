'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import StarRating from './StarRating'
import { motion, AnimatePresence } from 'motion/react'
import { User, Calendar, CheckCircle } from 'lucide-react'

interface IReview {
    _id: string
    userName: string
    rating: number
    comment: string
    verified: boolean
    createdAt: string
}

export default function ReviewList({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<IReview[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`/api/reviews?productId=${productId}`)
                if (res.data.success) {
                    setReviews(res.data.reviews)
                }
            } catch (error) {
                console.error("Error fetching reviews", error)
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [productId])

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Customer Reviews ({reviews.length})
                </h3>
            </div>

            <AnimatePresence>
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100 hover:border-green-200 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                                                {review.userName}
                                                {review.verified && (
                                                    <CheckCircle size={14} className="text-green-500" />
                                                )}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                <Calendar size={12} />
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} size={14} showNumber={false} />
                                </div>
                                <p className="text-zinc-600 text-sm leading-relaxed">
                                    "{review.comment}"
                                </p>
                                {review.verified && (
                                    <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md">
                                        <CheckCircle size={10} />
                                        Verified Purchase
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200 text-zinc-400">
                        <p className="text-lg font-bold">No reviews yet</p>
                        <p className="text-sm">Be the first to share your experience!</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

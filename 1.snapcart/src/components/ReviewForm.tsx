'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Star, X, Send } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import StarRating from './StarRating'

interface ReviewFormProps {
    productId: string
    productName: string
    onReviewSubmitted?: () => void
    onClose?: () => void
}

export default function ReviewForm({
    productId,
    productName,
    onReviewSubmitted,
    onClose
}: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        if (comment.trim().length < 10) {
            toast.error('Review must be at least 10 characters')
            return
        }

        setLoading(true)

        try {
            const response = await axios.post('/api/reviews', {
                product: productId,
                rating,
                comment: comment.trim()
            })

            if (response.data.success) {
                toast.success('Review submitted successfully!')
                setRating(0)
                setComment('')
                onReviewSubmitted?.()
                onClose?.()
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to submit review')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Write a Review
                        </h2>
                        <p className="text-gray-600">
                            Share your experience with <span className="font-semibold">{productName}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Your Rating *
                            </label>
                            <StarRating
                                rating={rating}
                                interactive
                                onRatingChange={setRating}
                                size={32}
                                showNumber={false}
                            />
                            {rating > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {rating === 1 && '⭐ Poor'}
                                    {rating === 2 && '⭐⭐ Fair'}
                                    {rating === 3 && '⭐⭐⭐ Good'}
                                    {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                                    {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                                </p>
                            )}
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Review *
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us about your experience with this product..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                rows={5}
                                required
                                minLength={10}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum 10 characters ({comment.length}/10)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading || rating === 0 || comment.trim().length < 10}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${loading || rating === 0 || comment.trim().length < 10
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Submit Review
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

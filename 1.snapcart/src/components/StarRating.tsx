'use client'

import { Star } from 'lucide-react'
import { motion } from 'motion/react'

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: number
    showNumber?: boolean
    reviewCount?: number
    interactive?: boolean
    onRatingChange?: (rating: number) => void
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = 20,
    showNumber = true,
    reviewCount,
    interactive = false,
    onRatingChange
}: StarRatingProps) {
    const stars = Array.from({ length: maxRating }, (_, i) => i + 1)

    const handleClick = (starValue: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(starValue)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {stars.map((star) => {
                    const isFull = star <= Math.floor(rating)
                    const isPartial = star === Math.ceil(rating) && rating % 1 !== 0
                    const fillPercentage = isPartial ? (rating % 1) * 100 : 0

                    return (
                        <motion.div
                            key={star}
                            whileHover={interactive ? { scale: 1.2 } : {}}
                            whileTap={interactive ? { scale: 0.9 } : {}}
                            onClick={() => handleClick(star)}
                            className={interactive ? 'cursor-pointer' : ''}
                        >
                            <div className="relative" style={{ width: size, height: size }}>
                                {/* Background star (gray) */}
                                <Star
                                    size={size}
                                    className="text-gray-300 absolute top-0 left-0"
                                    fill="currentColor"
                                />

                                {/* Filled star */}
                                {isFull && (
                                    <Star
                                        size={size}
                                        className="text-amber-400 absolute top-0 left-0"
                                        fill="currentColor"
                                    />
                                )}

                                {/* Partial fill */}
                                {isPartial && (
                                    <div
                                        className="absolute top-0 left-0 overflow-hidden"
                                        style={{ width: `${fillPercentage}%` }}
                                    >
                                        <Star
                                            size={size}
                                            className="text-amber-400"
                                            fill="currentColor"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {showNumber && (
                <div className="flex items-center gap-1 text-sm">
                    <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                    {reviewCount !== undefined && reviewCount > 0 && (
                        <span className="text-gray-500">({reviewCount})</span>
                    )}
                </div>
            )}
        </div>
    )
}

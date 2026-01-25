'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Quote, Star } from 'lucide-react'
import axios from 'axios'

const MOCK_REVIEWS = [
    {
        _id: '1',
        name: "Aarav Patel",
        role: "Chef",
        content: "The quality of the foxtail millet is exceptional. It has brought authentic texture to my traditional recipes.",
        rating: 5,
        location: "Mumbai"
    },
    {
        _id: '2',
        name: "Priya Sharma",
        role: "Nutritionist",
        content: "Traceability is a game changer. Knowing exactly which farm my food comes from gives me immense peace of mind.",
        rating: 5,
        location: "Delhi"
    },
    {
        _id: '3',
        name: "Rahul Verma",
        role: "Home Cook",
        content: "Fast delivery and premium packaging. The millet flour was fresh and made the softest rotis!",
        rating: 4,
        location: "Bangalore"
    },
    {
        _id: '4',
        name: "Sneha Reddy",
        role: "Yoga Instructor",
        content: "Highly recommend for anyone switching to a healthier organic diet. Best verified organic marketplace.",
        rating: 5,
        location: "Hyderabad"
    },
    {
        _id: '5',
        name: "Vikram Singh",
        role: "Buyer",
        content: "Bulk ordering was seamless. The quality consistency across large batches is impressive.",
        rating: 5,
        location: "Pune"
    },
    {
        _id: '6',
        name: "Ananya Das",
        role: "Food Blogger",
        content: "The variety of millet snacks is amazing. Healthy, tasty, and perfect for on-the-go snacking.",
        rating: 4,
        location: "Kolkata"
    }
]

function ReviewMarquee() {
    const [reviews, setReviews] = useState(MOCK_REVIEWS)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('/api/reviews/get')
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setReviews([...res.data, ...MOCK_REVIEWS])
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error)
            }
        }
        fetchReviews()
    }, [])

    return (
        <section className="w-full py-20 overflow-hidden bg-zinc-50 relative">
            <div className="w-[95%] md:w-[85%] mx-auto mb-12">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-[2px] bg-green-500"></span>
                    <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Community Voices</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">Trusted by <span className="text-zinc-400">Thousands</span></h2>
            </div>

            <div className="flex relative w-full">
                <div className="flex gap-6 animate-infinite-scroll hover:pause-animation pl-6">
                    {[...reviews, ...reviews].map((review, index) => (
                        <div
                            key={`${review._id}-${index}`}
                            className="bg-white rounded-[2rem] p-8 w-[350px] md:w-[400px] shrink-0 border border-zinc-100 shadow-xl shadow-zinc-900/5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                        >
                            <div className="mb-6 flex justify-between items-start">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <Quote size={24} className="fill-current" />
                                </div>
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200 fill-zinc-200"}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-zinc-600 font-medium leading-relaxed mb-6 italic line-clamp-4">"{review.content}"</p>

                            <div className="flex items-center gap-4 border-t border-zinc-50 pt-4">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-zinc-200 to-zinc-300 flex items-center justify-center font-bold text-zinc-500 text-sm">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-900 text-sm truncate max-w-[150px]">{review.name}</h4>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wide">{review.role || "Community Member"} • {review.location || "India"}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-infinite-scroll {
                    animation: infinite-scroll 40s linear infinite;
                }
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}

export default ReviewMarquee

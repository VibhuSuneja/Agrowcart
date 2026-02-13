'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { X, Clock, ChefHat, Heart, Flame, Play, Volume2, Pause, Check, Share2, ArrowLeft } from 'lucide-react'

interface RecipeDetailModalProps {
    isOpen: boolean
    onClose: () => void
    recipe: {
        _id?: string
        title: string
        description?: string
        image: string
        video?: string
        audioNote?: string
        chef: string
        timeToCook: string
        difficulty: string
        likes: number
        ingredients?: string[]
        instructions?: string[]
        tags?: string[]
    }
    onLike?: () => void
    isLiked?: boolean
}

export default function RecipeDetailModal({ isOpen, onClose, recipe, onLike, isLiked = false }: RecipeDetailModalProps) {
    const [isPlayingVideo, setIsPlayingVideo] = useState(false)
    const [isPlayingAudio, setIsPlayingAudio] = useState(false)
    const [checkedSteps, setCheckedSteps] = useState<number[]>([])

    const toggleStep = (index: number) => {
        setCheckedSteps(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    const handleShare = async () => {
        try {
            await navigator.share({
                title: recipe.title,
                text: recipe.description || `Check out this amazing millet recipe: ${recipe.title}`,
                url: window.location.href
            })
        } catch (e) {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center overflow-y-auto p-4 py-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Custom Header with Back Button */}
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition group"
                                title="Go Back"
                            >
                                <ArrowLeft className="w-5 h-5 text-zinc-700 group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </div>
                        {/* Hero Image/Video */}
                        <div className="relative h-64 md:h-80 flex-shrink-0">
                            {recipe.video && isPlayingVideo ? (
                                <video
                                    src={recipe.video}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    controls
                                    playsInline
                                />
                            ) : (
                                <Image
                                    src={recipe.image}
                                    alt={recipe.title}
                                    fill
                                    className="object-cover"
                                />
                            )}

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
                                title="Close"
                            >
                                <X className="w-5 h-5 text-zinc-700" />
                            </button>

                            {/* Video play button */}
                            {recipe.video && !isPlayingVideo && (
                                <button
                                    onClick={() => setIsPlayingVideo(true)}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition">
                                        <Play className="w-7 h-7 text-zinc-900 ml-1" fill="currentColor" />
                                    </div>
                                </button>
                            )}

                            {/* Title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex gap-2 mb-3">
                                    {recipe.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{recipe.title}</h1>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6 md:p-8">
                                {/* Meta info bar */}
                                <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-zinc-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                            <ChefHat size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Chef</div>
                                            <div className="font-bold text-zinc-900">{recipe.chef}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Time</div>
                                            <div className="font-bold text-zinc-900">{recipe.timeToCook}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${recipe.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                                            recipe.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            <Flame size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Level</div>
                                            <div className="font-bold text-zinc-900">{recipe.difficulty}</div>
                                        </div>
                                    </div>

                                    <div className="ml-auto flex items-center gap-3">
                                        <button
                                            onClick={onLike}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${isLiked
                                                ? 'bg-red-50 text-red-600'
                                                : 'bg-zinc-100 text-zinc-600 hover:bg-red-50 hover:text-red-600'
                                                }`}
                                        >
                                            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                                            <span>{recipe.likes}</span>
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                {recipe.description && (
                                    <div className="mb-8">
                                        <p className="text-zinc-600 text-lg leading-relaxed">{recipe.description}</p>
                                    </div>
                                )}

                                {/* Audio Note */}
                                {recipe.audioNote && (
                                    <div className="mb-8">
                                        <button
                                            onClick={() => {
                                                const audio = document.getElementById('recipe-detail-audio') as HTMLAudioElement;
                                                if (isPlayingAudio) {
                                                    audio?.pause();
                                                } else {
                                                    audio?.play();
                                                }
                                                setIsPlayingAudio(!isPlayingAudio);
                                            }}
                                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-purple-500/25 hover:shadow-xl transition"
                                        >
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                {isPlayingAudio ? <Pause size={24} /> : <Volume2 size={24} />}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Chef's Audio Note</div>
                                                <div className="text-white/70 text-sm">Listen to cooking tips & tricks</div>
                                            </div>
                                        </button>
                                        <audio
                                            id="recipe-detail-audio"
                                            src={recipe.audioNote}
                                            onEnded={() => setIsPlayingAudio(false)}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Ingredients */}
                                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                                        <div>
                                            <h2 className="text-xl font-black text-zinc-900 mb-4 flex items-center gap-2">
                                                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm">🥗</span>
                                                Ingredients
                                            </h2>
                                            <ul className="space-y-3">
                                                {recipe.ingredients.map((ingredient, i) => (
                                                    <li key={i} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                        <span className="text-zinc-700 font-medium">{ingredient}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Instructions */}
                                    {recipe.instructions && recipe.instructions.length > 0 && (
                                        <div>
                                            <h2 className="text-xl font-black text-zinc-900 mb-4 flex items-center gap-2">
                                                <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 text-sm">📝</span>
                                                Instructions
                                            </h2>
                                            <ol className="space-y-3">
                                                {recipe.instructions.map((step, i) => (
                                                    <li
                                                        key={i}
                                                        onClick={() => toggleStep(i)}
                                                        className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition ${checkedSteps.includes(i)
                                                            ? 'bg-green-50 border border-green-200'
                                                            : 'bg-zinc-50 hover:bg-zinc-100'
                                                            }`}
                                                    >
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm transition ${checkedSteps.includes(i)
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-zinc-200 text-zinc-600'
                                                            }`}>
                                                            {checkedSteps.includes(i) ? <Check size={14} /> : i + 1}
                                                        </div>
                                                        <span className={`text-zinc-700 font-medium leading-relaxed ${checkedSteps.includes(i) ? 'line-through text-zinc-400' : ''
                                                            }`}>
                                                            {step}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

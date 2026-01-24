'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Clock, ChefHat, Heart, Flame, Play, Volume2, Pause, Trash2, Pencil } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface RecipeCardProps {
    id?: string
    title: string
    description?: string
    image: string
    video?: string
    audioNote?: string
    chef: string
    chefId?: string
    time: string
    difficulty: string
    likes: number
    likedBy?: string[]
    currentUserId?: string
    userRole?: string
    tags: string[]
    ingredients?: string[]
    instructions?: string[]
    onLikeUpdate?: (id: string, liked: boolean, likes: number) => void
    onDelete?: (id: string) => void
    onEdit?: (recipe: any) => void
    onClick?: () => void
}

function RecipeCard({
    id,
    title,
    description,
    image,
    video,
    audioNote,
    chef,
    chefId,
    time,
    difficulty,
    likes: initialLikes,
    likedBy = [],
    currentUserId,
    userRole,
    tags,
    ingredients,
    instructions,
    onLikeUpdate,
    onDelete,
    onEdit,
    onClick
}: RecipeCardProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [isLiked, setIsLiked] = useState(false)
    const [isLiking, setIsLiking] = useState(false)
    const [showHeartAnimation, setShowHeartAnimation] = useState(false)
    const [isPlayingVideo, setIsPlayingVideo] = useState(false)
    const [isPlayingAudio, setIsPlayingAudio] = useState(false)

    // Sync isLiked state with props (handles both string and ObjectId comparisons)
    useEffect(() => {
        if (currentUserId) {
            const liked = likedBy.some(uid => uid.toString() === currentUserId.toString())
            setIsLiked(liked)
        } else {
            setIsLiked(false)
        }
    }, [likedBy, currentUserId])

    // Sync likes count with props
    useEffect(() => {
        setLikes(initialLikes)
    }, [initialLikes])

    const handleLike = async () => {
        if (!id || isLiking) return

        setIsLiking(true)

        try {
            const res = await axios.post(`/api/recipes/${id}/like`)

            // Always use server response as source of truth
            setLikes(res.data.likes)
            setIsLiked(res.data.liked)
            onLikeUpdate?.(id, res.data.liked, res.data.likes)

            // Show animation only when liking
            if (res.data.liked) {
                setShowHeartAnimation(true)
                setTimeout(() => setShowHeartAnimation(false), 1000)
            }
        } catch (error) {
            toast.error("Please login to like recipes")
        } finally {
            // Add a cooldown to prevent rapid clicks
            setTimeout(() => {
                setIsLiking(false)
            }, 500)
        }
    }

    const handleDoubleClick = () => {
        if (!isLiked && id) {
            handleLike()
        } else if (!isLiked) {
            setShowHeartAnimation(true)
            setTimeout(() => setShowHeartAnimation(false), 1000)
        }
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card click
        if (!id) return

        if (!confirm('Are you sure you want to delete this recipe?')) return

        try {
            await axios.delete(`/api/recipes/${id}`)
            toast.success('Recipe deleted successfully')
            onDelete?.(id)
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to delete recipe'
            toast.error(message)
        }
    }

    // Check if current user can delete
    const canDelete = id && (userRole === 'admin' || (currentUserId && chefId && currentUserId === chefId))

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-zinc-900/5 border border-zinc-100 group cursor-pointer relative"
            onDoubleClick={handleDoubleClick}
            onClick={onClick}
        >
            {/* Action Buttons - Only visible for admin or creator */}
            {canDelete && (
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <button
                        onClick={handleDelete}
                        className="w-8 h-8 bg-red-500/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 hover:scale-110"
                        title="Delete recipe"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.({ id, title, description, image, video, audioNote, chef, chefId, time, difficulty, likes: initialLikes, likedBy, tags, ingredients, instructions });
                        }}
                        className="w-8 h-8 bg-blue-500/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600 hover:scale-110"
                        title="Edit recipe"
                    >
                        <Pencil size={14} />
                    </button>
                </div>
            )}

            {/* Media Section */}
            <div className="h-48 relative overflow-hidden">
                {video && isPlayingVideo ? (
                    <video
                        src={video}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        onClick={() => setIsPlayingVideo(false)}
                    />
                ) : (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                )}

                {/* Heart Animation Overlay (Instagram-style) */}
                <AnimatePresence>
                    {showHeartAnimation && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                        >
                            <Heart className="w-24 h-24 text-white fill-red-500 drop-shadow-2xl" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Time Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <Clock size={12} className="text-zinc-400" />
                    <span>{time}</span>
                </div>

                {/* Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Video Play Button */}
                {video && !isPlayingVideo && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsPlayingVideo(true); }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl">
                            <Play className="w-6 h-6 text-zinc-900 ml-1" fill="currentColor" />
                        </div>
                    </button>
                )}

                {/* Audio Note Badge */}
                {audioNote && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isPlayingAudio) {
                                const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
                                audio?.pause();
                            } else {
                                const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
                                audio?.play();
                            }
                            setIsPlayingAudio(!isPlayingAudio);
                        }}
                        className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                    >
                        {isPlayingAudio ? <Pause size={12} /> : <Volume2 size={12} />}
                        <span>Audio Note</span>
                    </button>
                )}
            </div>

            {/* Hidden Audio Element */}
            {audioNote && (
                <audio
                    id={`audio-${id}`}
                    src={audioNote}
                    onEnded={() => setIsPlayingAudio(false)}
                    className="hidden"
                />
            )}

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-zinc-900 leading-tight group-hover:text-green-600 transition-colors line-clamp-2">{title}</h3>
                    <div className="flex flex-col items-center ml-2">
                        <motion.button
                            whileTap={{ scale: 0.6 }}
                            onClick={(e) => { e.stopPropagation(); handleLike(); }}
                            className="relative"
                            disabled={isLiking}
                        >
                            <motion.div
                                animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Heart
                                    size={24}
                                    className={`transition-colors duration-300 ${isLiked
                                        ? 'text-red-500 fill-red-500'
                                        : 'text-zinc-300 hover:text-red-400'
                                        }`}
                                />
                            </motion.div>
                            {/* Like burst animation */}
                            <AnimatePresence>
                                {isLiked && showHeartAnimation && (
                                    <>
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, opacity: 1 }}
                                                animate={{
                                                    scale: 2,
                                                    opacity: 0,
                                                    x: Math.cos(i * 60 * Math.PI / 180) * 20,
                                                    y: Math.sin(i * 60 * Math.PI / 180) * 20
                                                }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full"
                                                style={{ marginLeft: -4, marginTop: -4 }}
                                            />
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.button>
                        <motion.span
                            key={likes}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-[10px] font-bold text-zinc-400 mt-1"
                        >
                            {likes}
                        </motion.span>
                    </div>
                </div>

                <div className="flex items-center gap-4 border-t border-zinc-50 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <ChefHat size={14} />
                        </div>
                        <div className="text-xs">
                            <div className="text-zinc-400 font-bold uppercase tracking-wider text-[8px]">Chef</div>
                            <div className="font-bold text-zinc-900">{chef}</div>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-zinc-100" />

                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${difficulty === 'Easy' ? 'bg-blue-50 text-blue-500' : difficulty === 'Medium' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                            <Flame size={14} />
                        </div>
                        <div className="text-xs">
                            <div className="text-zinc-400 font-bold uppercase tracking-wider text-[8px]">Skill</div>
                            <div className="font-bold text-zinc-900">{difficulty}</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default RecipeCard

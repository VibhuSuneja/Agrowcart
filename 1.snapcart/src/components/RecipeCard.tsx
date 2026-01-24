'use client'
import React from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Clock, ChefHat, Heart, Flame } from 'lucide-react'

interface RecipeCardProps {
    title: string
    image: string
    chef: string
    time: string
    difficulty: string
    likes: number
    tags: string[]
}

function RecipeCard({ title, image, chef, time, difficulty, likes, tags }: RecipeCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-zinc-900/5 border border-zinc-100 group cursor-pointer"
        >
            <div className="h-48 relative overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <Clock size={12} className="text-zinc-400" />
                    <span>{time}</span>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                    {tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-zinc-900 leading-tight group-hover:text-green-600 transition-colors line-clamp-2">{title}</h3>
                    <div className="flex flex-col items-center ml-2">
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            className="text-zinc-300 hover:text-red-500 transition-colors"
                        >
                            <Heart size={20} className="fill-current" />
                        </motion.button>
                        <span className="text-[10px] font-bold text-zinc-400 mt-1">{likes}</span>
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${difficulty === 'Easy' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
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

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, Utensils, Timer, ChefHat, HeartPulse, X, Loader } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Recipe {
    recipeName: string
    preparationTime: string
    difficulty: string
    ingredients: string[]
    instructions: string[]
    nutritionalBenefit: string
}

export default function AIRecipeButton({ productName, category }: { productName: string, category: string }) {
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const generateRecipe = async () => {
        setLoading(true)
        setShowModal(true)
        try {
            const res = await axios.post('/api/ai/millet-recipe', { productName, category })
            setRecipe(res.data)
        } catch (error) {
            toast.error("Failed to conjure recipe. Try again!")
            setShowModal(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateRecipe}
                className="w-full mt-6 py-4 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <ChefHat size={18} className="relative z-10" />
                <span className="relative z-10">AI Chef Recipe</span>
                <Sparkles size={16} className="relative z-10 animate-pulse" />
            </motion.button>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-3xl relative z-[210] p-10 md:p-12 scrollbar-hide"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-8 right-8 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-50 p-3 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            {loading ? (
                                <div className="h-[400px] flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-8 border-orange-100 rounded-full animate-pulse" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Utensils size={40} className="text-orange-500 animate-bounce" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Conjuring Magic...</h3>
                                        <p className="text-zinc-500 font-medium">Gemini is drafting a gourmet millet recipe for you.</p>
                                    </div>
                                </div>
                            ) : recipe && (
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                            <Sparkles size={12} />
                                            <span>AI-Generated SGI (Synthetically Generated Information)</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter leading-none">{recipe.recipeName}</h2>

                                        <div className="flex flex-wrap gap-4 pt-4">
                                            <div className="px-4 py-2 bg-zinc-50 rounded-xl flex items-center gap-2 border border-zinc-100">
                                                <Timer size={16} className="text-orange-500" />
                                                <span className="text-xs font-bold text-zinc-700">{recipe.preparationTime}</span>
                                            </div>
                                            <div className="px-4 py-2 bg-zinc-50 rounded-xl flex items-center gap-2 border border-zinc-100">
                                                <ChefHat size={16} className="text-orange-500" />
                                                <span className="text-xs font-bold text-zinc-700">{recipe.difficulty}</span>
                                            </div>
                                            <div className="px-4 py-2 bg-green-50 rounded-xl flex items-center gap-2 border border-green-100">
                                                <HeartPulse size={16} className="text-green-600" />
                                                <span className="text-xs font-bold text-green-700">Healthy choice</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                                                <Utensils size={20} className="text-orange-500" />
                                                Ingredients
                                            </h3>
                                            <ul className="space-y-3">
                                                {recipe.ingredients.map((ing, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-200 mt-1.5 shrink-0" />
                                                        <span className="text-zinc-600 text-sm font-medium">{ing}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                                                <Sparkles size={20} className="text-orange-500" />
                                                AI Analysis
                                            </h3>
                                            <div className="p-6 bg-green-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12" />
                                                <p className="text-xs font-medium leading-relaxed italic relative z-10">
                                                    "{recipe.nutritionalBenefit}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                                            <Utensils size={20} className="text-orange-500" />
                                            Instructions
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {recipe.instructions.map((step, i) => (
                                                <div key={i} className="flex gap-6 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 hover:border-orange-200 transition-all group">
                                                    <span className="text-4xl font-black text-orange-200 group-hover:text-orange-500 transition-colors leading-none">{i + 1}</span>
                                                    <p className="text-zinc-600 text-sm font-medium leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="w-full py-6 bg-zinc-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-zinc-900/20 active:scale-95 transition-all"
                                        >
                                            I'll Try This Recipe!
                                        </button>
                                        <p className="text-[9px] text-zinc-400 font-bold text-center uppercase tracking-widest">
                                            Mandatory Disclosure: This content is generated by AI (Gemini) and may contain errors. Please use culinary discretion.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

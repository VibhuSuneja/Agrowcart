'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import RecipeCard from '@/components/RecipeCard'
import CreateRecipeModal from '@/components/CreateRecipeModal'
import RecipeDetailModal from '@/components/RecipeDetailModal'
import ExpertOpinions from '@/components/ExpertOpinions'
import { Plus, ChefHat, Search, Loader, Sparkles, ArrowLeft } from 'lucide-react'
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

function CommunityRecipes() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [recipes, setRecipes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const [editingRecipe, setEditingRecipe] = useState<any | null>(null)

    const fetchRecipes = async () => {
        try {
            const res = await axios.get('/api/recipes')
            setRecipes(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRecipes()
    }, [])

    const handleEdit = (recipe: any) => {
        setEditingRecipe(recipe)
        setIsModalOpen(true)
    }

    // Filter recipes based on search
    const filteredRecipes = recipes.filter(recipe =>
        recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.chef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleShareClick = () => {
        if (!userData) {
            toast.error('Please login to share a recipe')
            return
        }
        setEditingRecipe(null)
        setIsModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-zinc-50 selection:bg-green-100 selection:text-green-900">
            <Nav user={userData || { name: "Guest", email: "", role: "user" }} />
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-600 font-bold mb-8 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-green-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Marketplace</span>
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-green-600 font-black uppercase tracking-[0.3em] text-[10px] bg-green-50 w-fit px-3 py-1 rounded-lg border border-green-100"
                        >
                            <ChefHat size={14} />
                            <span>Community Kitchen</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight leading-none"
                        >
                            Millet<br />Recipes
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-zinc-500 max-w-md"
                        >
                            Discover healthy millet recipes shared by our community. From breakfast to dinner, find your next favorite dish!
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition text-sm font-medium"
                            />
                        </div>

                        {/* Share Recipe Button */}
                        <button
                            onClick={handleShareClick}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xl shadow-green-600/25 hover:shadow-2xl hover:shadow-green-600/40 hover:scale-105 transition-all"
                        >
                            <Plus size={18} />
                            <span>Share Recipe</span>
                        </button>
                    </motion.div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="animate-spin text-green-600" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRecipes.length > 0 ? filteredRecipes.map((recipe, i) => (
                            <motion.div
                                key={recipe._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <RecipeCard
                                    id={recipe._id}
                                    title={recipe.title}
                                    description={recipe.description}
                                    image={recipe.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800'}
                                    video={recipe.video}
                                    audioNote={recipe.audioNote}
                                    chef={recipe.chef}
                                    chefId={recipe.chefId}
                                    time={recipe.timeToCook}
                                    difficulty={recipe.difficulty}
                                    likes={recipe.likes || 0}
                                    likedBy={recipe.likedBy || []}
                                    currentUserId={userData?._id}
                                    userRole={userData?.role}
                                    tags={recipe.tags || []}
                                    ingredients={recipe.ingredients || []}
                                    instructions={recipe.instructions || []}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    onDelete={(id) => {
                                        setRecipes(prev => prev.filter(r => r._id !== id))
                                        setSelectedRecipe(null)
                                    }}
                                    onEdit={handleEdit}
                                    onLikeUpdate={(id, liked, likes) => {
                                        setRecipes(prev => prev.map(r =>
                                            r._id === id ? {
                                                ...r, likes, likedBy: liked
                                                    ? [...(r.likedBy || []), userData?._id]
                                                    : (r.likedBy || []).filter((uid: string) => uid !== userData?._id)
                                            } : r
                                        ))
                                    }}
                                />
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                                    <ChefHat size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 mb-2">
                                    {searchQuery ? 'No recipes found' : 'No Recipes Yet'}
                                </h3>
                                <p className="text-zinc-400">
                                    {searchQuery ? 'Try a different search term' : 'Be the first to share a millet masterpiece!'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Not logged in message */}
                {!userData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-8 text-center"
                    >
                        <Sparkles className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-zinc-900 mb-2">Join Our Community</h3>
                        <p className="text-zinc-600 mb-6 max-w-md mx-auto">
                            Login to like recipes, share your own creations, and connect with other millet enthusiasts!
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition"
                        >
                            Login to Participate
                        </a>
                    </motion.div>
                )}
            </div>

            <ExpertOpinions />

            <Footer />

            {/* Create/Edit Recipe Modal */}
            {userData && (
                <CreateRecipeModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingRecipe(null)
                    }}
                    onSuccess={fetchRecipes}
                    userName={userData?.name || 'Anonymous Chef'}
                    initialData={editingRecipe}
                />
            )}

            {/* Recipe Detail Modal */}
            {selectedRecipe && (
                <RecipeDetailModal
                    isOpen={!!selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                    recipe={{
                        _id: selectedRecipe._id,
                        title: selectedRecipe.title,
                        description: selectedRecipe.description,
                        image: selectedRecipe.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
                        video: selectedRecipe.video,
                        audioNote: selectedRecipe.audioNote,
                        chef: selectedRecipe.chef,
                        timeToCook: selectedRecipe.timeToCook,
                        difficulty: selectedRecipe.difficulty,
                        likes: selectedRecipe.likes || 0,
                        ingredients: selectedRecipe.ingredients || [],
                        instructions: selectedRecipe.instructions || [],
                        tags: selectedRecipe.tags || []
                    }}
                    isLiked={userData?._id ? (selectedRecipe.likedBy || []).includes(userData._id) : false}
                />
            )}
        </div>
    )
}

export default CommunityRecipes

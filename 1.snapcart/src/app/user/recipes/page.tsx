'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import RecipeCard from '@/components/RecipeCard'
import { Plus, ChefHat, Search, Loader } from 'lucide-react'
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

function MilletKitchen() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [recipes, setRecipes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        fetchRecipes()
    }, [])

    return (
        <div className="min-h-screen bg-zinc-50 selection:bg-green-100 selection:text-green-900">
            <Nav user={userData || { name: "Guest", email: "", role: "user" }} />
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-none'
                        >
                            Millet <span className="text-zinc-400">Recipes.</span>
                        </motion.h1>
                        <p className="text-zinc-500 max-w-lg font-medium text-lg">Discover healthy, delicious ways to cook with organic millets shared by our community.</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-zinc-900 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-zinc-900/20"
                    >
                        <Plus size={18} />
                        <span>Share Recipe</span>
                    </motion.button>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-zinc-900/5 border border-zinc-100 flex items-center max-w-xl mb-12">
                    <div className="w-12 h-12 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center text-zinc-400">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for Ragi Dosa, Foxtail Salad..."
                        className="flex-1 px-4 outline-none text-zinc-700 font-bold placeholder:font-medium placeholder:text-zinc-300"
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="animate-spin text-green-600" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.length > 0 ? recipes.map((recipe, i) => (
                            <motion.div
                                key={recipe._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <RecipeCard
                                    title={recipe.title}
                                    image={recipe.image}
                                    chef={recipe.chef}
                                    time={recipe.timeToCook}
                                    difficulty={recipe.difficulty}
                                    likes={recipe.likes}
                                    tags={recipe.tags}
                                />
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                                    <ChefHat size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 mb-2">No Recipes Yet</h3>
                                <p className="text-zinc-400">Be the first to share a millet masterpiece!</p>
                            </div>
                        )}

                        {/* Mock data for showcase if empty */}
                        {recipes.length === 0 && (
                            <>
                                <RecipeCard
                                    title="Crispy Ragi Dosa with Coconut Chutney"
                                    image="https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/ragi-dosa-recipe.jpg"
                                    chef="Sanjive Kapoor"
                                    time="20 mins"
                                    difficulty="Easy"
                                    likes={124}
                                    tags={["Breakfast", "Gluten-Free"]}
                                />
                                <RecipeCard
                                    title="Foxtail Millet Salad Bowl"
                                    image="https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sibyl_sunitha/Foxtail_Millet_Salad_Recipe_with_Roasted_Carrots_and_Chickpeas.jpg"
                                    chef="Anjali D."
                                    time="15 mins"
                                    difficulty="Easy"
                                    likes={89}
                                    tags={["Healthy", "Vegan"]}
                                />
                                <RecipeCard
                                    title="Little Millet Upma"
                                    image="https://rakskitchen.net/wp-content/uploads/2014/05/Saamai-upma.jpg"
                                    chef="Grandma's Kitchen"
                                    time="25 mins"
                                    difficulty="Medium"
                                    likes={256}
                                    tags={["Tradition", "Dinner"]}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default MilletKitchen

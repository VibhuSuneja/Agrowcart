'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import ProductItemCard from './ProductItemCard'

interface Product {
    _id: string
    name: string
    price: number
    image: string
    category: string
    unit: string
    rating: number
    reviewCount: number
    [key: string]: any
}

interface SimilarProductsProps {
    currentProductId: string
    category: string
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ currentProductId, category }) => {
    const [similar, setSimilar] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSimilar = async () => {
            try {
                // Fetch all products and filter by category, excluding current product
                const res = await axios.get('/api/product/get-products')
                const allProducts = res.data
                const filtered = allProducts
                    .filter((p: Product) => p.category === category && p._id !== currentProductId)
                    .slice(0, 4) // Show top 4 similar products
                setSimilar(filtered)
            } catch (error) {
                console.error("Error fetching similar products", error)
            } finally {
                setLoading(false)
            }
        }
        if (category && currentProductId) fetchSimilar()
    }, [category, currentProductId])

    if (loading) return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/5] bg-zinc-100 rounded-[2rem] animate-pulse" />
            ))}
        </div>
    )

    if (similar.length === 0) return null

    return (
        <div className="mt-24 space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                        <Sparkles size={14} />
                        <span>Recommended for you</span>
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Similar <span className="text-green-600">Harvests.</span></h2>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {similar.map((product, idx) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <ProductItemCard item={product as any} />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default SimilarProducts

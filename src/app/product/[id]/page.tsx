'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
    ArrowLeft, ShoppingCart, Star, ShieldCheck, Sprout,
    Info, Leaf, MapPin, Calendar, Fingerprint, Zap,
    Minus, Plus, Sparkles, Share2, Heart, MessageSquare, Microscope
} from 'lucide-react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice'
import toast from 'react-hot-toast'
import StarRating from '@/components/StarRating'
import ReviewForm from '@/components/ReviewForm'
import ReviewList from '@/components/ReviewList'
import AIRecipeButton from '@/components/AIRecipeButton'
import SustainabilityScore from '@/components/SustainabilityScore'
import ShareModal from '@/components/ShareModal'
import NegotiationChat from '@/components/NegotiationChat'

function ProductDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [showNegotiation, setShowNegotiation] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const { cartData } = useSelector((state: RootState) => state.cart)
    const { userData } = useSelector((state: RootState) => state.user) // Get current user
    const cartItem = cartData.find(i => i._id.toString() === id)

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`/api/product/${id}`)
            setProduct(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Product not found")
        } finally {
            setLoading(false)
        }
    }

    const fetchWishlist = async () => {
        try {
            const res = await axios.get('/api/user/wishlist')
            if (res.data.success) {
                const inWishlist = res.data.wishlist.some((wishId: string) => wishId === id)
                setIsWishlisted(inWishlist)
            }
        } catch (error) {
            console.error("Error fetching wishlist", error)
        }
    }

    useEffect(() => {
        if (id) {
            fetchProduct()
            fetchWishlist()
        }
    }, [id])

    const toggleWishlist = async () => {
        setIsWishlisted(!isWishlisted)
        try {
            const res = await axios.post('/api/user/wishlist', { productId: id })
            if (!res.data.success) {
                setIsWishlisted(!isWishlisted)
                toast.error("Failed to update wishlist")
            } else {
                toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
            }
        } catch (error) {
            setIsWishlisted(!isWishlisted)
            toast.error("Login to use wishlist")
        }
    }

    const handleShare = async () => {
        const url = `${window.location.origin}/product/${id}`
        const title = `Check out this highly nutritious ${product.name}!`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Pure, traceable ${product.name} from millet farmers.`,
                    url: url
                })
            } catch (err) {
                // If user cancels, we don't show the modal to avoid double-sharing
                // But if it's an error, we show our modal
                if ((err as Error).name !== 'AbortError') {
                    setShowShareModal(true)
                }
            }
        } else {
            setShowShareModal(true)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <Info size={64} className="text-zinc-200 mb-6" />
                <h1 className="text-3xl font-black text-zinc-900 mb-2">Product Not Found</h1>
                <p className="text-zinc-500 mb-8 font-medium">The item you are looking for might have been retired.</p>
                <button
                    onClick={() => router.push('/')}
                    className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold"
                >
                    Back to Marketplace
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 selection:bg-green-100 selection:text-green-900">
            <Nav user={userData as any} />
            <div className="pt-32 pb-20 w-[95%] md:w-[90%] lg:w-[85%] mx-auto">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-500 hover:text-green-600 font-bold mb-10 transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-green-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to collection</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section */}
                    <div className="relative">
                        <div className="sticky top-32">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-square bg-white rounded-[4rem] overflow-hidden shadow-2xl shadow-green-900/5 border border-zinc-100 p-12 lg:p-20 group"
                            >
                                <Image
                                    src={product.image}
                                    fill
                                    alt={product.name}
                                    className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-10 left-10 flex flex-col gap-3">
                                    {product.rating > 0 && (
                                        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-zinc-100">
                                            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={16} />
                                        </div>
                                    )}
                                    <div className="bg-green-600 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-green-600/20 w-fit">
                                        <ShieldCheck size={16} className="text-white" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Certified</span>
                                    </div>
                                </div>
                                <div className="absolute top-10 right-10 flex flex-col gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleWishlist}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm border ${isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'bg-white text-zinc-400 border-zinc-100 hover:text-red-500'}`}
                                    >
                                        <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleShare}
                                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-400 hover:text-green-600 transition-colors shadow-sm border border-zinc-100"
                                    >
                                        <Share2 size={20} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border border-green-100"
                            >
                                <Leaf size={14} />
                                <span>{product.category}</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-none"
                            >
                                {product.name}
                            </motion.h1>
                            <div className="flex items-baseline gap-4 pt-4">
                                <span className="text-5xl font-black text-zinc-900">₹{product.price}</span>
                                <span className="text-xl font-bold text-zinc-400">per {product.unit}</span>
                                {product.priceAI && (
                                    <div className="ml-4 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                                        <Sparkles size={12} />
                                        <span>AI Advised Value</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center gap-6"
                        >
                            <div className="flex items-center bg-white rounded-3xl p-2 gap-6 border border-zinc-200 shadow-sm">
                                <button
                                    onClick={() => dispatch(decreaseQuantity(product._id))}
                                    disabled={!cartItem}
                                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-50 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="text-2xl font-black text-zinc-900 min-w-[30px] text-center">{cartItem?.quantity || 0}</span>
                                <button
                                    onClick={() => cartItem ? dispatch(increaseQuantity(product._id)) : dispatch(addToCart({ ...product, quantity: 1 }))}
                                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-50 hover:bg-green-50 hover:text-green-600 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <button
                                onClick={() => !cartItem && dispatch(addToCart({ ...product, quantity: 1 }))}
                                className="flex-1 bg-zinc-900 text-white py-6 px-10 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-green-600 shadow-2xl shadow-zinc-900/20 transition-all"
                            >
                                <ShoppingCart size={20} />
                                <span>{cartItem ? 'In Your Bag' : 'Add to Basket'}</span>
                            </button>
                            <button
                                onClick={() => {
                                    if (!userData) {
                                        toast.error("Please login to negotiate")
                                        router.push('/login')
                                        return
                                    }
                                    if (!product.owner) {
                                        toast.error("Contact info unavailable for this product")
                                        return
                                    }
                                    setShowNegotiation(true)
                                }}
                                className="w-full bg-white border-2 border-zinc-900 text-zinc-900 py-6 px-10 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all"
                            >
                                <MessageSquare size={20} />
                                <span>Bulk Inquiry</span>
                            </button>
                        </motion.div>

                        <SustainabilityScore quantity={cartItem?.quantity || 1} unit={product.unit} />
                        <AIRecipeButton productName={product.name} category={product.category} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Fingerprint size={24} />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">Traceable Origin</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-zinc-400 uppercase tracking-widest">Farm ID</span>
                                        <span className="text-zinc-900">{product.farmId || 'VRF-4290'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-zinc-400 uppercase tracking-widest">Harvested</span>
                                        <span className="text-zinc-900">{product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Dec 2023'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-zinc-400 uppercase tracking-widest">Region</span>
                                        <span className="text-zinc-900">Kolar, Karnataka</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">Nutritional Profile</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protein</div>
                                        <div className="text-sm font-black text-zinc-800">12.3g</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fiber</div>
                                        <div className="text-sm font-black text-zinc-800">8.9g</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Iron</div>
                                        <div className="text-sm font-black text-zinc-800">3.2mg</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Gluten</div>
                                        <div className="text-sm font-black text-green-600">FREE</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scientific Benefits Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="p-8 bg-green-900 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                                    <Microscope size={20} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Scientific Knowledge</h3>
                            </div>
                            <p className="text-green-50/80 text-sm font-medium leading-relaxed italic border-l-2 border-green-500/50 pl-4">
                                {product.scientificBenefits || "This millet is technically a power-grain with a low glycemic index, making it ideal for managing blood sugar levels while providing a high concentration of antioxidants and amino acids."}
                            </p>
                        </motion.div>

                        <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                                    <Sprout size={20} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Sustainable Choice</h3>
                            </div>
                            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                                This millet requires 70% less water than rice and supports local biodiversity. By choosing {product.name}, you are helping 12 small-scale farmers in the Deccan region.
                            </p>
                        </div>

                        {/* Review Section Toggle */}
                        <div className="pt-10 border-t border-zinc-200">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-zinc-900">Community Feedback</h2>
                                    <p className="text-zinc-500 font-medium">Hear what other health enthusiasts say</p>
                                </div>
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/10"
                                >
                                    <MessageSquare size={18} />
                                    Write Review
                                </button>
                            </div>

                            <ReviewList productId={id as string} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showReviewForm && (
                    <ReviewForm
                        productId={id as string}
                        productName={product.name}
                        onClose={() => setShowReviewForm(false)}
                        onReviewSubmitted={() => {
                            fetchProduct() // Refresh rating
                        }}
                    />
                )}

                {showNegotiation && userData && product.owner && (
                    <NegotiationChat
                        productId={product._id}
                        buyerId={userData._id!}
                        farmerId={product.owner._id || product.owner}
                        farmerName={product.owner.name || "Farmer"}
                        onClose={() => setShowNegotiation(false)}
                    />
                )}
                {showShareModal && (
                    <ShareModal
                        isOpen={showShareModal}
                        onClose={() => setShowShareModal(false)}
                        url={typeof window !== 'undefined' ? `${window.location.origin}/product/${id}` : ''}
                        title={`Check out this highly nutritious ${product.name}!`}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    )
}

export default ProductDetailPage

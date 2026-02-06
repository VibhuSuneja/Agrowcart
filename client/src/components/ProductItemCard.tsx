'use client'
import React from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import { Minus, Plus, ShoppingCart, Star, ShieldCheck, Heart, Share2, MapPin } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice'
import Link from 'next/link'
import StarRating from './StarRating'
import axios from 'axios'
import toast from 'react-hot-toast'

interface IProduct {
  _id: string,
  name: string,
  category: string,
  price: string,
  unit: string,
  image: string,
  farmId?: string,
  harvestDate?: string,
  rating?: number,
  reviewCount?: number,
  scientificBenefits?: string,
  createdAt?: Date,
  updatedAt?: Date,
  isCompliant?: boolean,
  fssaiLicense?: string,
  originState?: string,
  originCity?: string,
  stock?: number | null // null = in stock, 0 = out of stock
}

function ProductItemCard({ item }: { item: IProduct }) {
  const dispatch = useDispatch<AppDispatch>()
  const { cartData } = useSelector((state: RootState) => state.cart)
  const cartItem = cartData.find(i => i._id.toString() == item._id)
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  React.useEffect(() => {
    // Fetch initial wishlist state if needed, or get from centralized state
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('/api/user/wishlist')
        if (res.data.success) {
          const inWishlist = res.data.wishlist.some((id: string) => id === item._id)
          setIsWishlisted(inWishlist)
        }
      } catch (error) {
        console.error("Error fetching wishlist", error)
      }
    }
    fetchWishlist()
  }, [item._id])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Optimistic UI update
    setIsWishlisted(!isWishlisted)

    try {
      const res = await axios.post('/api/user/wishlist', { productId: item._id })
      if (!res.data.success) {
        setIsWishlisted(isWishlisted) // Fallback
        toast.error("Failed to update wishlist")
      } else {
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
      }
    } catch (error: any) {
      setIsWishlisted(isWishlisted) // Fallback
      toast.error(error.response?.data?.error || "Login to use wishlist")
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/product/${item._id}`
    const title = `Check out this ${item.name}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Highly nutritious ${item.name} from Snapcart.`,
          url: url
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className='group relative flex flex-col overflow-hidden rounded-[2rem] glass-panel hover:bg-white/15 dark:hover:bg-white/5 transition-all duration-300 h-full border border-zinc-200/50 dark:border-white/5'
    >
      <Link href={`/product/${item._id}`} className='block p-3'>
        <div className='relative w-full aspect-square bg-zinc-50 dark:bg-zinc-900/50 rounded-[1.5rem] overflow-hidden group-hover:shadow-inner transition-all'>
          <Image
            src={item.image}
            fill
            alt={item.name}
            sizes='(max-width: 768px) 100vw, 25vw'
            className='object-cover transition-transform duration-700 group-hover:scale-105'
          />

          {/* Traceability Badge */}
          <div className='absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white border border-white/10 shadow-lg z-10'>
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="uppercase tracking-wider">AI Verified</span>
          </div>

          {/* Favorite Button */}
          <div className='absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm border transition-all ${isWishlisted
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-black/40 border-white/20 text-white hover:bg-red-500'
                }`}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </motion.button>
          </div>

          {/* Out of Stock Badge */}
          {item.stock === 0 && (
            <div className='absolute inset-0 bg-background-dark/60 backdrop-blur-sm flex items-center justify-center z-20'>
              <div className='bg-red-500 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg'>
                Out of Stock
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className='flex flex-col flex-1 p-5 pt-2'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20'>
            {item.category}
          </span>
          {item.rating && item.rating > 0 && (
            <div className="flex items-center gap-1 text-gold-harvest text-[10px] font-bold bg-gold-harvest/10 px-2 py-1 rounded-md">
              <Star size={12} fill="currentColor" />
              <span>{item.rating}</span>
            </div>
          )}
        </div>

        <Link href={`/product/${item._id}`}>
          <div className="flex items-center gap-1 text-zinc-400 mb-1">
            <MapPin size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.originCity || 'Karnataka'}</span>
          </div>
          <h3 className='text-zinc-900 dark:text-white font-extrabold text-lg leading-tight mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-1'>
            {item.name}
          </h3>
        </Link>

        {/* Pricing and Action */}
        <div className='mt-auto flex items-center justify-between gap-4'>
          <div className='flex flex-col'>
            <span className='text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest'>Price</span>
            <div className='flex items-baseline gap-1'>
              <span className='text-gold-harvest font-black text-2xl'>₹{item.price}</span>
              <span className='text-[10px] text-zinc-400 dark:text-zinc-500 font-medium'>/{item.unit || 'kg'}</span>
            </div>
          </div>

          <div className="flex-1 max-w-[120px]">
            {item.stock === 0 ? (
              <div className='h-11 w-full bg-zinc-100 dark:bg-white/5 text-zinc-400 flex items-center justify-center rounded-xl font-bold text-[10px] uppercase tracking-widest'>
                Sold Out
              </div>
            ) : !cartItem ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                className='h-11 w-full bg-primary text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all font-bold text-sm'
              >
                <ShoppingCart size={18} />
                <span>Buy</span>
              </motion.button>
            ) : (
              <div className='flex items-center bg-zinc-100 dark:bg-white/5 rounded-xl p-1 gap-2 border border-zinc-200 dark:border-white/5'>
                <button
                  className='w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-background-dark text-zinc-600 dark:text-zinc-300 hover:text-red-500 transition-colors shadow-sm'
                  onClick={() => dispatch(decreaseQuantity(item._id))}
                >
                  <Minus size={14} />
                </button>
                <span className='text-sm font-black text-zinc-900 dark:text-white min-w-[20px] text-center'>{cartItem.quantity}</span>
                <button
                  className='w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-background-dark text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 transition-colors shadow-sm'
                  onClick={() => dispatch(increaseQuantity(item._id))}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductItemCard



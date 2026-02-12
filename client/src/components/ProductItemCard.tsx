'use client'
import React from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import { Minus, Plus, ShoppingCart, Star, ShieldCheck, Heart, Share2, MapPin, Award } from 'lucide-react'
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
  isGITagged?: boolean,
  giCertificationId?: string,
}

function ProductItemCard({ item }: { item: IProduct }) {
  const dispatch = useDispatch<AppDispatch>()
  const { cartData } = useSelector((state: RootState) => state.cart)
  const cartItem = cartData.find(i => i._id.toString() == item._id)
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  React.useEffect(() => {
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
    setIsWishlisted(!isWishlisted)
    try {
      const res = await axios.post('/api/user/wishlist', { productId: item._id })
      if (!res.data.success) {
        setIsWishlisted(isWishlisted)
        toast.error("Failed to update wishlist")
      } else {
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
      }
    } catch (error: any) {
      setIsWishlisted(isWishlisted)
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
          text: `Highly nutritious ${item.name} from AgrowCart.`,
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className='bg-white dark:bg-zinc-900/40 rounded-[2.5rem] p-4 shadow-2xl shadow-zinc-900/5 group relative flex flex-col h-full border border-zinc-100 dark:border-white/5 hover:border-primary/30 transition-all duration-500'
    >
      <Link href={`/product/${item._id}`} className='block relative'>
        <div className='relative w-full aspect-[4/5] bg-zinc-50 dark:bg-white/5 rounded-[2rem] overflow-hidden mb-5 group-hover:shadow-inner transition-all'>
          <Image
            src={item.image}
            fill
            alt={item.name}
            sizes='(max-width: 768px) 100vw, 25vw'
            className='object-cover transition-transform duration-700 group-hover:scale-110'
          />

          <div className='absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

          {/* Action Overlay */}
          <div className='absolute top-4 right-4 flex flex-col gap-2 z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl shadow-lg border transition-all ${isWishlisted
                ? 'bg-red-500 border-red-400 text-white'
                : 'bg-white/90 dark:bg-zinc-900/90 border-white/20 text-zinc-400 hover:text-red-500'
                }`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              aria-label="Share product"
              className='w-10 h-10 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-primary shadow-lg border border-white/20 transition-all'
            >
              <Share2 size={18} />
            </motion.button>
          </div>

          <div className='absolute top-4 left-4 flex flex-col gap-2'>
            {item.rating && item.rating > 0 ? (
              <div className='bg-primary/90 dark:bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg border border-white/20 flex items-center gap-1.5'>
                <Star size={12} fill="white" className="text-white" />
                <span className="text-[10px] font-black text-white">{item.rating}</span>
              </div>
            ) : null}
          </div>

          {item.farmId && (
            <div className='absolute bottom-4 left-4 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2'>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className='text-[8px] font-black text-white uppercase tracking-[0.2em]'>Traceable Hub</span>
            </div>
          )}

          {item.stock === 0 && (
            <div className='absolute inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center'>
              <div className='bg-white/10 border border-white/20 text-white px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl backdrop-blur-xl'>
                Out of Stock
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className='flex flex-col flex-1 px-1'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-[9px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10'>
            {item.category}
          </span>
          <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
            <MapPin size={10} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.originCity || 'Haryana'}</span>
          </div>
        </div>

        {/* Trust Badges — FSSAI & GI Tag */}
        {(item.fssaiLicense || item.isGITagged) && (
          <div className='flex items-center gap-1.5 mb-2 flex-wrap'>
            {item.fssaiLicense && (
              <div className='flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-500/20'>
                <ShieldCheck size={10} />
                <span className='text-[8px] font-black uppercase tracking-widest'>FSSAI</span>
              </div>
            )}
            {item.isGITagged && (
              <div className='flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-500/20'>
                <Award size={10} />
                <span className='text-[8px] font-black uppercase tracking-widest'>GI Tag</span>
              </div>
            )}
          </div>
        )}

        <Link href={`/product/${item._id}`}>
          <h3 className='text-slate-900 dark:text-white font-black text-lg leading-[1.2] mb-3 group-hover:text-primary transition-colors tracking-tight line-clamp-2'>
            {item.name}
          </h3>
        </Link>

        <div className='mt-auto flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-white/5'>
          <div className='flex flex-col'>
            <span className='text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-0.5'>Market Rate</span>
            <div className='flex items-baseline gap-1'>
              <span className='text-zinc-900 dark:text-white font-black text-2xl tracking-tighter'>₹{item.price}</span>
              <span className='text-[10px] text-zinc-400 font-bold'>/{item.unit || 'kg'}</span>
            </div>
          </div>

          {item.stock === 0 ? (
            <div className='bg-zinc-100 dark:bg-white/5 text-zinc-400 px-4 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-white/10'>
              Sold Out
            </div>
          ) : !cartItem ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
              aria-label="Add to cart"
              className='w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl agrow-glow group-hover:scale-110 transition-all'
            >
              <ShoppingCart size={20} />
            </motion.button>
          ) : (
            <div className='flex items-center bg-zinc-100 dark:bg-white/5 rounded-2xl p-1 gap-3 border border-zinc-200 dark:border-white/10'>
              <button
                className='w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-red-500 transition-colors shadow-sm'
                onClick={() => dispatch(decreaseQuantity(item._id))}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className='text-sm font-black text-slate-900 dark:text-white min-w-[20px] text-center'>{cartItem.quantity}</span>
              <button
                className='w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors shadow-sm'
                onClick={() => dispatch(increaseQuantity(item._id))}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductItemCard



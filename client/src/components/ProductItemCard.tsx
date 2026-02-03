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
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className='bg-white rounded-[2.5rem] p-5 shadow-2xl shadow-green-900/5 group relative flex flex-col h-full border border-zinc-100 hover:border-green-200 transition-all'
    >
      <Link href={`/product/${item._id}`} className='block'>
        <div className='relative w-full aspect-square bg-zinc-50 rounded-[2rem] overflow-hidden mb-6 group-hover:shadow-inner transition-all'>
          <Image
            src={item.image}
            fill
            alt={item.name}
            sizes='(max-width: 768px) 100vw, 25vw'
            className='object-contain p-8 transition-transform duration-700 group-hover:scale-110'
          />

          {/* Top Actions */}
          <div className='absolute top-4 right-4 flex flex-col gap-2 z-10'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-sm border transition-all ${isWishlisted
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-white/80 border-white/50 text-zinc-400 hover:text-red-500'
                }`}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className='w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-green-600 shadow-sm border border-white/50 transition-all'
            >
              <Share2 size={20} />
            </motion.button>
          </div>

          <div className='absolute top-4 left-4 flex flex-col gap-2'>
            {item.rating && item.rating > 0 ? (
              <div className='bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-xl shadow-sm border border-white/50'>
                <StarRating
                  rating={Number(item.rating) || 0}
                  reviewCount={Number(item.reviewCount) || 0}
                  size={12}
                  showNumber={true}
                />
              </div>
            ) : null}
          </div>
          {item.farmId && (
            <div className='absolute bottom-4 left-4 bg-zinc-900/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20'>
              <span className='text-[8px] font-black text-zinc-900 uppercase tracking-widest'>Traceable</span>
            </div>
          )}

          {item.isCompliant && (
            <div className='absolute bottom-4 right-4 bg-green-500 backdrop-blur-md px-3 py-1 rounded-full border border-green-400 flex items-center gap-1.5 shadow-lg shadow-green-500/20'>
              <ShieldCheck size={12} className="text-white" />
              <span className='text-[8px] font-black text-white uppercase tracking-widest'>Verified Seller</span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {item.stock === 0 && (
            <div className='absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center'>
              <div className='bg-red-500 text-white px-4 py-2 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg'>
                Out of Stock
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className='flex flex-col flex-1 px-1'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100'>
            {item.category}
          </span>
          <span className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest'>
            {item.unit}
          </span>
        </div>

        <Link href={`/product/${item._id}`}>
          <h3 className='text-zinc-900 font-extrabold text-xl leading-tight mb-2 group-hover:text-green-600 transition-colors tracking-tight line-clamp-2'>
            {item.name}
          </h3>
          <div className="flex items-center gap-1.5 text-zinc-400 mb-5">
            <MapPin size={10} className="text-zinc-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.originCity ? `${item.originCity}, ` : ''}{item.originState || 'Haryana'}</span>
          </div>
        </Link>

        <div className='mt-auto flex items-center justify-between gap-4'>
          <div className='flex flex-col'>
            <span className='text-[10px] text-zinc-400 font-black uppercase tracking-widest'>Price</span>
            <div className='flex items-baseline gap-1'>
              <span className='text-zinc-900 font-black text-2xl'>₹{item.price}</span>
            </div>
          </div>

          {item.stock === 0 ? (
            <div className='bg-zinc-100 text-zinc-400 px-4 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest'>
              Sold Out
            </div>
          ) : !cartItem ? (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              suppressHydrationWarning
              onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
              className='w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-zinc-900/20 group-hover:bg-green-600 group-hover:shadow-green-500/30 transition-all'
            >
              <ShoppingCart size={22} />
            </motion.button>
          ) : (
            <div className='flex items-center bg-zinc-100 rounded-2xl p-1 gap-4 border border-zinc-200'>
              <button
                className='w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm'
                onClick={() => dispatch(decreaseQuantity(item._id))}
              >
                <Minus size={16} />
              </button>
              <span className='text-base font-black text-zinc-900 min-w-[20px] text-center'>{cartItem.quantity}</span>
              <button
                className='w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-green-50 hover:text-green-500 transition-colors shadow-sm'
                onClick={() => dispatch(increaseQuantity(item._id))}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductItemCard



'use client'
import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash, Trash2, Sparkles, Receipt, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import Image from 'next/image'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/cartSlice'
import { useRouter } from 'next/navigation'
import SustainabilityScore from '@/components/SustainabilityScore'
import Nav from '@/components/Nav'

function CartPage() {
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector((state: RootState) => state.cart)
  const { userData } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  return (
    <div className='min-h-screen bg-zinc-50 pb-24 pt-12'>
      <Nav user={userData as any} />
      <div className='w-[95%] sm:w-[90%] md:w-[85%] mx-auto relative pt-24'>

        <Link href="/" className='inline-flex items-center gap-2 text-zinc-500 hover:text-green-600 font-bold transition-all group mb-12'>
          <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:border-green-600 transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span className='text-sm uppercase tracking-widest'>Back to Marketplace</span>
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
            <ShoppingBag size={14} />
            <span>Millet Value Chain</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-black text-zinc-900 tracking-tight'>Shopping Cart</h1>
        </div>

        {cartData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-zinc-200 shadow-inner'
          >
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBasket className='w-12 h-12 text-zinc-300' />
            </div>
            <h2 className='text-2xl font-black text-zinc-900 mb-2'>Your cart is empty</h2>
            <p className='text-zinc-500 font-medium mb-10 max-w-xs mx-auto'>Add some highly nutritious millets to your cart to continue with the checkout.</p>
            <Link href="/" className='bg-zinc-900 text-white px-10 py-5 rounded-2xl hover:bg-green-600 transition-all font-bold shadow-xl shadow-zinc-900/10'>
              Explore Marketplace
            </Link>
          </motion.div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            <div className='lg:col-span-2 space-y-6'>
              <AnimatePresence>
                {cartData.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className='flex flex-col sm:flex-row items-center bg-white rounded-[2.5rem] shadow-xl shadow-zinc-900/5 p-6 border border-zinc-100 group relative'
                  >
                    <div className='relative w-32 h-32 sm:w-28 sm:h-28 flex-shrink-0 rounded-3xl overflow-hidden bg-zinc-50 p-4'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className='object-contain transition-transform duration-500 group-hover:scale-110'
                      />
                    </div>

                    <div className='mt-6 sm:mt-0 sm:ml-8 flex-1 text-center sm:text-left'>
                      <div className="flex flex-col gap-1">
                        <h3 className='text-xl font-black text-zinc-900 tracking-tight leading-tight'>{item.name}</h3>
                        <span className='px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-black uppercase text-zinc-500 w-fit mx-auto sm:mx-0'>Verified Quality</span>
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <div>
                          <div className="text-[10px] font-black uppercase text-zinc-400">Unit</div>
                          <div className="text-sm font-bold text-zinc-600">{item.unit}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase text-zinc-400">Price</div>
                          <div className="text-sm font-bold text-green-600">₹{Number(item.price)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 sm:mt-0">
                      <div className='flex items-center bg-zinc-50 p-1 rounded-2xl border border-zinc-100'>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className='w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center hover:border-green-600 transition-colors'
                          onClick={() => dispatch(decreaseQuantity(item._id))}
                        >
                          <Minus size={14} className='text-zinc-600' />
                        </motion.button>
                        <span className='font-black text-zinc-900 w-12 text-center text-lg'>{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className='w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center hover:border-green-600 transition-colors'
                          onClick={() => dispatch(increaseQuantity(item._id))}
                        >
                          <Plus size={14} className='text-zinc-600' />
                        </motion.button>
                      </div>

                      <div className='text-center sm:text-right min-w-[100px]'>
                        <div className="text-[10px] font-black uppercase text-zinc-400">Total</div>
                        <div className="text-xl font-black text-zinc-900 tracking-tight">₹{Number(item.price) * item.quantity}</div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className='text-zinc-300 hover:text-red-500 transition-colors p-2'
                        onClick={() => dispatch(removeFromCart(item._id))}
                      >
                        <Trash2 size={24} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className='lg:col-span-1 h-fit sticky top-32'>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className='bg-zinc-900 rounded-[3rem] shadow-2xl p-10 text-white relative overflow-hidden'
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>
                <div className="flex items-center gap-3 text-green-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                  <Receipt size={16} />
                  <span>Checkout Summary</span>
                </div>

                <div className='space-y-6'>
                  <div className='flex justify-between items-center text-zinc-400'>
                    <span className="font-medium text-sm">Subtotal</span>
                    <span className='font-black text-white'>₹{subTotal}</span>
                  </div>
                  <div className='flex justify-between items-center text-zinc-400'>
                    <span className="font-medium text-sm">Logistics Fee</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className='font-black text-white'>₹{deliveryFee}</span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 mt-8">
                    <div className='flex justify-between items-end'>
                      <div>
                        <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Final Amount</div>
                        <div className="text-4xl font-black tracking-tighter">₹{finalTotal}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase text-green-500 tracking-widest mb-1">Water Saved</div>
                        <div className="text-xl font-black text-green-400">
                          {cartData.reduce((acc, item) => {
                            let mult = item.unit === 'kg' ? 1 : 0.5;
                            return acc + (item.quantity * mult * 1600)
                          }, 0).toLocaleString()}L
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full mt-10 bg-green-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-green-900/20 transition-all flex items-center justify-center gap-3 hover:bg-green-700'
                    onClick={() => router.push("/user/checkout")}
                  >
                    <span>Secure Checkout</span>
                    <Sparkles size={18} />
                  </motion.button>

                  <p className="text-[10px] text-zinc-500 text-center mt-6 font-medium">Verified by Millet Value Chain Trust Protocol</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage


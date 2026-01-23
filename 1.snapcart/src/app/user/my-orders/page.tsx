'use client'
import axios from 'axios'
import { ArrowLeft, Package, PackageSearch, Sparkles, TrendingUp, History } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "motion/react"
import React, { useEffect, useState } from 'react'
import UserOrderCard from '@/components/UserOrderCard'
import { getSocket } from '@/lib/socket'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface IOrder {
  _id?: string
  user: string
  items: [
    {
      grocery: string,
      name: string,
      price: string,
      unit: string,
      image: string
      quantity: number
    }
  ]
  isPaid: boolean
  totalAmount: number,
  paymentMethod: "cod" | "online"
  address: {
    fullName: string,
    mobile: string,
    city: string,
    state: string,
    pincode: string,
    fullAddress: string,
    latitude: number,
    longitude: number
  }
  assignment?: string
  assignedDeliveryBoy?: any
  status: "pending" | "out of delivery" | "delivered",
  createdAt?: Date
  updatedAt?: Date
}

function MyOrder() {
  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-orders")
        setOrders(result.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getMyOrders()
  }, [])

  useEffect(() => {
    const socket = getSocket()
    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) => prev?.map((o) => (
        o._id === orderId ? { ...o, assignedDeliveryBoy } : o
      )))
    })
    return () => { socket.off("order-assigned") }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-zinc-50 selection:bg-green-100 selection:text-green-900'>
      <div className='max-w-4xl mx-auto px-6 py-32'>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-600 font-black uppercase tracking-[0.3em] text-[10px] bg-green-50 w-fit px-3 py-1 rounded-lg border border-green-100"
            >
              <History size={14} />
              <span>Procurement History</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-none'
            >
              My <span className="text-zinc-400">Orders.</span>
            </motion.h1>
            <p className="text-zinc-500 max-w-lg font-medium text-lg">Track your millet batches from the farm to your doorstep in real-time.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="bg-white p-4 rounded-3xl shadow-xl shadow-green-900/5 border border-zinc-100 flex items-center gap-4 group transition-all hover:border-green-200"
          >
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </div>
            <div className="text-left pr-4">
              <div className="text-[10px] font-black uppercase text-zinc-400">Continue</div>
              <div className="text-sm font-black text-zinc-900">Shopping</div>
            </div>
          </motion.button>
        </div>

        {orders?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='py-32 flex flex-col items-center text-center bg-white rounded-[3.5rem] border-2 border-dashed border-zinc-200'
          >
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <PackageSearch size={48} className="text-zinc-200" />
            </div>
            <h2 className='text-3xl font-black text-zinc-800 mb-2 tracking-tight'>No Batches Found</h2>
            <p className='text-zinc-400 font-medium max-w-xs mx-auto'>You haven't secured any millet harvests yet. Explore the marketplace to start your journey.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-10 bg-zinc-900 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-zinc-900/20 hover:bg-green-600 transition-all"
            >
              Start Exploring
            </button>
          </motion.div>
        ) : (
          <div className='space-y-8'>
            <AnimatePresence>
              {orders?.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <UserOrderCard order={order} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrder


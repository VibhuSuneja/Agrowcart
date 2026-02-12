import AdminOrderCard from '@/components/AdminOrderCard'
import { getSocket } from '@/lib/socket'
import dynamic from 'next/dynamic'
const LogisticsGlobalMap = dynamic(() => import('@/components/LogisticsGlobalMap'), { ssr: false })

import { IUser } from '@/models/user.model'
import axios from 'axios'
import { ArrowLeft, Truck } from 'lucide-react'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
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
  ,
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
  assignedDeliveryBoy?: IUser
  status: "pending" | "out of delivery" | "delivered" | "cancelled" | "refunded",
  createdAt?: Date
  updatedAt?: Date
}

interface IDeliveryPartner {
  id: string
  name: string
  location: { latitude: number, longitude: number }
  activeOrderCount: number
}

function ManageOrders() {
  const [orders, setOrders] = useState<IOrder[]>()
  const [partners, setPartners] = useState<IDeliveryPartner[]>([])
  const router = useRouter()

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders")
        setOrders(result.data)

        // Extract partners from orders
        const partnerMap = new Map<string, IDeliveryPartner>()
        result.data.forEach((o: IOrder) => {
          if (o.assignedDeliveryBoy && o.assignedDeliveryBoy._id && o.status === "out of delivery") {
            const pid = o.assignedDeliveryBoy._id.toString()
            if (partnerMap.has(pid)) {
              partnerMap.get(pid)!.activeOrderCount++
            } else {
              partnerMap.set(pid, {
                id: pid,
                name: o.assignedDeliveryBoy.name,
                location: {
                  latitude: o.assignedDeliveryBoy.location?.coordinates?.[1] || 0,
                  longitude: o.assignedDeliveryBoy.location?.coordinates?.[0] || 0,
                },
                activeOrderCount: 1
              })
            }
          }
        })
        setPartners(Array.from(partnerMap.values()))
      } catch (error) {
        console.log(error)
      }
    }
    getOrders()
  }, [])


  useEffect(() => {
    const socket = getSocket()
    socket?.on("new-order", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev!])
    })
    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) => prev?.map((o) => (
        o._id == orderId ? { ...o, assignedDeliveryBoy } : o
      )))
    })

    const handleLocationUpdate = (data: any) => {
      setPartners(prev => prev.map(p => {
        if (p.id === data.userId) {
          return {
            ...p,
            location: {
              latitude: data.location.coordinates?.[1] ?? data.location.latitude,
              longitude: data.location.coordinates?.[0] ?? data.location.longitude,
            }
          }
        }
        return p
      }))
    }

    socket.on("update-deliveryBoy-location", handleLocationUpdate)

    return () => {
      socket.off("new-order")
      socket.off("order-assigned")
      socket.off("update-deliveryBoy-location", handleLocationUpdate)
    }
  }, [])

  return (
    <div className='min-h-screen bg-zinc-50 w-full'>
      <div className='fixed top-0 left-0 w-full backdrop-blur-3xl bg-white/70 shadow-sm border-b border-zinc-100 z-50'>
        <div className='max-w-6xl mx-auto flex items-center justify-between px-6 py-4'>
          <div className="flex items-center gap-4">
            <button className='p-2 bg-zinc-100 rounded-xl hover:bg-zinc-200 active:scale-95 transition' onClick={() => router.push("/")}>
              <ArrowLeft size={20} className="text-zinc-600" />
            </button>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Manage Orders</h1>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
            <Truck size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-700">{partners.length} Agents Live</span>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-10'>
        {partners.length > 0 && (
          <LogisticsGlobalMap partners={partners} />
        )}

        <div className='space-y-6'>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 pl-2">Real-time Order Queue</h2>
          {orders?.map((order, index) => (
            <AdminOrderCard key={order._id?.toString() || index} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageOrders

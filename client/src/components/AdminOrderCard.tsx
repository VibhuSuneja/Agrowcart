'use client'

import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User, UserCheck, MessageSquareX, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import axios from 'axios'

import { IUser } from '@/models/user.model'
import { getSocket } from '@/lib/socket'
import dynamic from 'next/dynamic'
const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false })

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
function AdminOrderCard({ order }: { order: IOrder }) {
    const [expanded, setExpanded] = useState(false)
    const [status, setStatus] = useState<string>("pending")
    const [showTrack, setShowTrack] = useState(false)
    const [liveLocation, setLiveLocation] = useState<{ latitude: number, longitude: number } | null>(null)
    const statusOptions = ["pending", "out of delivery", "cancelled"]

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const result = await axios.post(`/api/admin/update-order-status/${orderId}`, { status })
            console.log(result.data)
            setStatus(status)

        } catch (error) {
            console.log(error)
        }
    }
    const deleteOrderChat = async () => {
        if (!confirm("Are you sure you want to purge all chat history for this order? This cannot be undone.")) return
        try {
            const result = await axios.post('/api/admin/delete-chats', { roomId: order._id })
            toast.success(`Purged ${result.data.deletedCount} chat messages!`)
        } catch (error) {
            toast.error("Failed to delete chats")
        }
    }

    useEffect(() => {
        setStatus(order.status)
        if (order.assignedDeliveryBoy?.location?.coordinates) {
            setLiveLocation({
                latitude: order.assignedDeliveryBoy.location.coordinates[1],
                longitude: order.assignedDeliveryBoy.location.coordinates[0]
            })
        }
    }, [order])

    useEffect((): any => {
        const socket = getSocket()
        socket.on("order-status-update", (data) => {
            if (data.orderId.toString() == order?._id!.toString()) {
                setStatus(data.status)
            }
        })
        return () => socket.off("order-status-update")
    }, [])

    useEffect(() => {
        if (!showTrack || !order.assignedDeliveryBoy?._id) return
        const socket = getSocket()
        const handleLocationUpdate = (data: any) => {
            if (data.userId === order.assignedDeliveryBoy?._id?.toString()) {
                setLiveLocation({
                    latitude: data.location.coordinates?.[1] ?? data.location.latitude,
                    longitude: data.location.coordinates?.[0] ?? data.location.longitude,
                })
            }
        }
        socket.on("update-deliveryBoy-location", handleLocationUpdate)
        return () => {
            socket.off("update-deliveryBoy-location", handleLocationUpdate)
        }
    }, [showTrack, order.assignedDeliveryBoy?._id])

    return (
        <motion.div
            key={order._id?.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all "
        >
            <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                <div className='space-y-1'>
                    <p className='text-lg font-bold flex items-center gap-2 text-green-700'>
                        <Package size={20} />
                        Order #{order._id?.toString().slice(-6)}
                    </p>
                    {status != "delivered" && <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${order.isPaid
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                        }`}>
                        {order.isPaid ? "Paid" : "Unpaid"}
                    </span>}

                    <p className='text-gray-500 text-sm'>
                        {new Date(order.createdAt!).toLocaleString()}
                    </p>


                    <div className='mt-3 space-y-1 text-gray-700 text-sm'>
                        <p className='flex items-center gap-2 font-semibold'>
                            <User size={16} className='text-green-600' />
                            <span>{order?.address.fullName}</span>
                        </p>
                        <p className='flex items-center gap-2 font-semibold'>
                            <Phone size={16} className='text-green-600' />
                            <span>{order?.address.mobile}</span>
                        </p>
                        <p className='flex items-center gap-2 font-semibold'>
                            <MapPin size={16} className='text-green-600' />
                            <span>{order?.address.fullAddress}</span>
                        </p>

                    </div>

                    <p className='mt-3 flex items-center gap-2 text-sm text-gray-700'>
                        <CreditCard size={16} className='text-green-600' />
                        <span>{order.paymentMethod === "cod" ? "Cash On Delivery" : "Online Payment"}</span>
                    </p>

                    {order.assignedDeliveryBoy && <div className='mt-4 flex flex-col gap-3'>
                        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between'>
                            <div className='flex items-center gap-3 text-sm text-gray-700'>
                                <UserCheck className="text-blue-600" size={18} />
                                <div className='font-semibold text-gray-800'>
                                    <p className=''>Assigned to : <span>{order.assignedDeliveryBoy.name}</span></p>
                                    <p className='text-xs text-gray-600'>📞 +91 {order.assignedDeliveryBoy.mobile}</p>
                                </div>
                            </div>

                            <a href={`tel:${order.assignedDeliveryBoy.mobile}`} className='bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-bold'>Call</a>
                        </div>
                        {status === "out of delivery" && (
                            <button
                                onClick={() => setShowTrack(!showTrack)}
                                className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${showTrack ? 'bg-zinc-900 text-white' : 'bg-green-600 text-white shadow-lg shadow-green-600/20'}`}
                            >
                                <Truck size={14} />
                                {showTrack ? "Hide Live Track" : "Live Track Partner"}
                            </button>
                        )}
                    </div>}

                    {showTrack && liveLocation && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-4 rounded-3xl overflow-hidden border border-zinc-100 shadow-inner"
                        >
                            <LiveMap
                                userLocation={{ latitude: order.address.latitude, longitude: order.address.longitude }}
                                deliveryBoyLocation={liveLocation}
                            />
                        </motion.div>
                    )}




                </div>

                <div className='flex flex-col items-start md:items-end gap-2'>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                        }`}>
                        {status}
                    </span>
                    {status != "delivered" && <select className='border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none'
                        value={status}
                        onChange={(e) => updateStatus(order._id?.toString()!, e.target.value)}
                    >
                        {statusOptions.map(st => (
                            <option key={st} value={st}>{st.toUpperCase()}</option>
                        ))}
                    </select>}
                    {order.assignment && (
                        <button
                            onClick={deleteOrderChat}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center gap-1.5 font-black uppercase text-[9px] tracking-widest mt-2"
                            title="Delete order chat history"
                        >
                            <MessageSquareX size={14} />
                            Purge Chat
                        </button>
                    )}
                </div>
            </div>
            <div className='border-t border-gray-200 mt-3 pt-3'>
                <button
                    onClick={() => setExpanded(prev => !prev)}
                    className='w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition'
                >

                    <span className='flex items-center gap-2'>
                        <Package size={16} className="text-green-600" />
                        {expanded ? "Hide Order Items" : `view ${order.items.length} Items`}
                    </span>

                    {expanded ? <ChevronUp size={16} className="text-green-600" /> : <ChevronDown size={16} className="text-green-600" />}

                </button>

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: expanded ? "auto" : 0,
                        opacity: expanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className='mt-3 space-y-3'>
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className='flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition'>
                                <div className='flex items-center gap-3'>
                                    <Image src={item.image} alt={item.name} width={48} height={48} className=" rounded-lg object-cover border border-gray-200" />
                                    <div>
                                        <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                                        <p className='text-xs text-gray-500'>{item.quantity} x {item.unit}</p>
                                    </div>
                                </div>
                                <p className='text-sm font-semibold text-gray-800'>₹{Number(item.price) * item.quantity}</p>

                            </div>
                        ))}
                    </div>

                </motion.div>

            </div>
            <div className='border-t pt-3 mt-3 flex justify-between items-center text-sm font-semibold text-gray-800'>
                <div className='flex items-center gap-2 text-gray-700 text-sm'>
                    <Truck size={16} className="text-green-600" />
                    <span>Delivery: <span className='text-green-700 font-semibold'>{status}</span></span>
                </div>
                <div>
                    Total: <span className='text-green-700 font-bold'>₹{order.totalAmount}</span>
                </div>
            </div>
        </motion.div>
    )
}

export default AdminOrderCard

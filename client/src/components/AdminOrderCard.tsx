'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User, UserCheck, MessageSquareX, Trash2, IndianRupee, X, PhoneIncoming } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import axios from 'axios'

import { IUser } from '@/models/user.model'
import { getSocket } from '@/lib/socket'
import { useSocket } from '@/context/SocketContext'
import dynamic from 'next/dynamic'
const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false })
import VoiceCall from './VoiceCall'

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
    const { userData } = useSelector((state: RootState) => state.user)
    const [expanded, setExpanded] = useState(false)
    const [status, setStatus] = useState<string>("pending")
    const [showTrack, setShowTrack] = useState(false)
    const [liveLocation, setLiveLocation] = useState<{ latitude: number, longitude: number } | null>(null)
    const statusOptions = ["pending", "out of delivery", "cancelled"]

    // Call State
    const { socket } = useSocket()
    const [isCalling, setIsCalling] = useState(false)
    const [receivingCall, setReceivingCall] = useState(false)
    const [incomingSignal, setIncomingSignal] = useState<any>(null)
    const [callRoomId, setCallRoomId] = useState("")
    const [otherPartyId, setOtherPartyId] = useState("")

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const result = await axios.post(`/api/admin/update-order-status/${orderId}`, { status })
            setStatus(status)

        } catch (error) {
            // Status update failed silently
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

        socket.on("incoming-call-alert", (data: any) => {
            if (data.roomId === order._id || data.roomId === `call:${order._id}`) {
                setReceivingCall(true)
                setIncomingSignal(data.signal)
                setCallRoomId(data.roomId)
                setOtherPartyId(data.from)
            }
        })

        return () => {
            socket.off("order-status-update")
            socket.off("incoming-call-alert")
        }
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

    const startCall = () => {
        if (!order.assignedDeliveryBoy?._id) return
        setCallRoomId(`call:${order._id}`)
        setOtherPartyId(order.assignedDeliveryBoy._id.toString())
        setIsCalling(true)
    }

    const handleCallEnd = () => {
        setIsCalling(false)
        setReceivingCall(false)
        setIncomingSignal(null)
    }

    const answerCall = () => {
        setReceivingCall(false)
        setIsCalling(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 transition-all relative"
        >
            <AnimatePresence>
                {receivingCall && !isCalling && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="absolute inset-x-6 top-6 z-50 bg-zinc-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-zinc-700"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-500 rounded-full animate-bounce">
                                <PhoneIncoming size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Delivery Partner Calling</h4>
                                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Live Audio Link</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setReceivingCall(false)} className="p-2 bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                                <X size={18} />
                            </button>
                            <button onClick={answerCall} className="p-2 bg-green-500 rounded-xl hover:bg-green-600 transition-colors">
                                <Phone size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {isCalling && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-sm h-[500px] bg-zinc-900 rounded-[3rem] overflow-hidden shadow-3xl">
                            <VoiceCall
                                roomId={callRoomId}
                                userId={userData?._id?.toString() || "admin"}
                                otherUserId={otherPartyId}
                                isInitiator={!incomingSignal}
                                incomingSignal={incomingSignal}
                                onEnd={handleCallEnd}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='flex flex-col md:flex-row justify-between gap-6'>
                <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                        <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
                        <h3 className='text-zinc-400 dark:text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]'>Order ID: {order?._id?.toString()}</h3>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-zinc-100 shadow-inner border border-zinc-100 dark:border-zinc-700'>
                            <MapPin size={24} />
                        </div>
                        <p className='text-sm font-black text-zinc-800 dark:text-zinc-200 leading-tight max-w-[250px]'>
                            {order.address.fullAddress}
                        </p>
                    </div>

                    <p className='mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 w-fit px-3 py-1 rounded-lg border border-zinc-100 dark:border-zinc-800'>
                        <CreditCard size={14} className='text-green-600' />
                        <span>{order.paymentMethod === "cod" ? "Cash On Delivery" : "Online Payment"}</span>
                    </p>

                    {order.assignedDeliveryBoy && <div className='mt-4 flex flex-col gap-3'>
                        <div className='bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 flex items-center justify-between'>
                            <div className='flex items-center gap-3 text-sm'>
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600">
                                    <UserCheck size={20} />
                                </div>
                                <div>
                                    <p className='text-[10px] font-black uppercase text-blue-400 tracking-widest leading-none'>Handover Partner</p>
                                    <p className='text-sm font-black text-blue-900 dark:text-blue-100 mt-1'>{order.assignedDeliveryBoy.name}</p>
                                    <p className='text-[10px] text-blue-600/70 font-bold'>📞 +91 {order.assignedDeliveryBoy.mobile}</p>
                                </div>
                            </div>

                            <button onClick={startCall} className='bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex items-center gap-2'>
                                <Phone size={12} />
                                Socket Call
                            </button>
                        </div>
                        {status === "out of delivery" && (
                            <button
                                onClick={() => setShowTrack(!showTrack)}
                                className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${showTrack ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-green-600 text-white shadow-xl shadow-green-600/20'}`}
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
                            className="mt-4 rounded-[2.5rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-2xl"
                        >
                            <LiveMap
                                userLocation={{ latitude: order.address.latitude, longitude: order.address.longitude }}
                                deliveryBoyLocation={liveLocation}
                            />
                        </motion.div>
                    )}
                </div>

                <div className='flex flex-col items-start md:items-end gap-3'>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${status === "delivered"
                        ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20"
                        : status === "pending"
                            ? "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20"
                            : status === "cancelled"
                                ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20"
                                : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20"
                        }`}>
                        {status}
                    </span>
                    {status != "delivered" && (
                        <select
                            className='bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl px-4 py-2 text-xs font-bold shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none w-full md:w-auto'
                            value={status}
                            onChange={(e) => updateStatus(order._id?.toString()!, e.target.value)}
                        >
                            {statusOptions.map(st => (
                                <option key={st} value={st}>{st.toUpperCase()}</option>
                            ))}
                        </select>
                    )}

                    <button
                        onClick={deleteOrderChat}
                        className="p-3 w-full md:w-auto rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5 font-black uppercase text-[9px] tracking-widest border border-red-100 dark:border-red-500/20"
                        title="Delete order chat history"
                    >
                        <MessageSquareX size={14} />
                        Purge Records
                    </button>

                </div>
            </div>
            <div className='border-t border-zinc-100 dark:border-zinc-800 mt-6 pt-6'>
                <button
                    onClick={() => setExpanded(prev => !prev)}
                    className='w-full flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-green-600 transition'
                >

                    <span className='flex items-center gap-2'>
                        <Package size={16} className="text-zinc-300 dark:text-zinc-600" />
                        {expanded ? "Collapse Batch" : `View ${order.items.length} Package Details`}
                    </span>

                    {expanded ? <ChevronDown size={16} className="rotate-180 transition-transform" /> : <ChevronDown size={16} className="transition-transform" />}

                </button>

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: expanded ? "auto" : 0,
                        opacity: expanded ? 1 : 0,
                    }}
                    className='overflow-hidden'
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
                        {order.items.map((item, index) => (
                            <div key={index} className='bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4'>
                                <div className='w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shrink-0'>
                                    <img src={item.image} alt={item.name} className='w-full h-full object-cover p-2' />
                                </div>
                                <div className='min-w-0'>
                                    <h4 className='text-xs font-black text-zinc-800 dark:text-zinc-200 truncate'>{item.name}</h4>
                                    <p className='text-[10px] font-bold text-zinc-500'>{item.quantity} x ₹{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='mt-6 p-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl flex items-center justify-between'>
                        <div className='flex flex-col'>
                            <span className='text-[9px] font-black uppercase tracking-[0.1em] opacity-60'>Total Settlement</span>
                            <span className='text-lg font-black'>₹{order.totalAmount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 dark:bg-black/10 px-3 py-1.5 rounded-lg border border-white/10 dark:border-black/10">
                            <IndianRupee size={12} />
                            Verified Payment
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default AdminOrderCard

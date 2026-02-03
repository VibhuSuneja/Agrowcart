'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import {
    ChevronDown, ChevronUp, CreditCard, MapPin, Package,
    Truck, UserCheck, Calendar, IndianRupee,
    ShieldCheck, ArrowRight, Phone, Navigation2, Sparkles, X
} from 'lucide-react'
import Image from 'next/image'
import { getSocket } from '@/lib/socket'
import { useRouter } from 'next/navigation'

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
    status: "pending" | "out of delivery" | "delivered" | "cancelled" | "refunded",
    createdAt?: Date
    updatedAt?: Date
    deliveryOtp?: string | null
}

function UserOrderCard({ order }: { order: IOrder }) {
    const [expanded, setExpanded] = useState(false)
    const [status, setStatus] = useState(order.status || "pending")
    const router = useRouter()

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100"
            case "out of delivery":
                return "bg-blue-50 text-blue-600 border-blue-100"
            case "delivered":
                return "bg-green-50 text-green-600 border-green-100"
            case "cancelled":
                return "bg-red-50 text-red-600 border-red-100"
            default:
                return "bg-zinc-50 text-zinc-600 border-zinc-100"
        }
    }

    useEffect(() => {
        const socket = getSocket()
        socket.on("order-status-update", (data) => {
            if (data.orderId.toString() === order?._id?.toString()) {
                setStatus(data.status)
            }
        })
        return () => { socket.off("order-status-update") }
    }, [order?._id])

    return (
        <motion.div
            layout
            className='bg-white rounded-[2.5rem] border border-zinc-100 shadow-2xl shadow-green-900/5 group overflow-hidden transition-all'
        >
            {/* Card Header */}
            <div className='p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-50'>
                <div className='flex items-center gap-6'>
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors ${status === "delivered" ? "bg-green-600 text-white" : "bg-zinc-900 text-white"}`}>
                        <Package size={32} />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className='text-3xl font-black text-zinc-900 tracking-tighter'>Batch <span className='text-zinc-400'>#{order?._id?.toString()?.slice(-6)}</span></h3>
                            {status === "delivered" && (
                                <div className="bg-green-50 p-1 rounded-full text-green-600">
                                    <ShieldCheck size={20} />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                            <Calendar size={12} />
                            <span>{new Date(order.createdAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                    <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyles(status)}`}>
                        {status}
                    </div>
                    {order.isPaid && (
                        <div className="bg-green-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                            Paid
                        </div>
                    )}
                </div>
            </div>

            <div className='p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
                {/* Logistics Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">Fulfillment Details</div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start gap-4 p-5 bg-zinc-50 rounded-[1.5rem] border border-zinc-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                                    <MapPin size={20} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Drop Location</div>
                                    <p className="text-sm font-bold text-zinc-700 leading-snug">{order.address.fullAddress}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 bg-zinc-50 rounded-[1.5rem] border border-zinc-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-sm">
                                    {order.paymentMethod === 'online' ? <CreditCard size={20} /> : <IndianRupee size={20} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Payment Method</div>
                                    <p className="text-sm font-black text-zinc-900 uppercase tracking-wider">{order.paymentMethod === 'online' ? 'Secured Online' : 'Cash on Delivery'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {status !== 'delivered' && status !== 'cancelled' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 bg-zinc-900 rounded-[2rem] text-white shadow-2xl shadow-zinc-900/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
                            <div className="relative">
                                {order.assignedDeliveryBoy ? (
                                    <>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-green-400">
                                                <Navigation2 size={24} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest leading-none">On Route with</div>
                                                <div className="text-xl font-black tracking-tight mt-1">{order.assignedDeliveryBoy.name}</div>
                                            </div>
                                        </div>

                                        {order.deliveryOtp && (
                                            <div className="p-4 bg-white/10 rounded-xl mb-6 border border-white/10 text-center">
                                                <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Your Delivery OTP</div>
                                                <div className="text-4xl font-black text-green-400 tracking-[0.2em]">{order.deliveryOtp}</div>
                                                <div className="text-[10px] text-zinc-500 mt-1">Share this code with the partner upon arrival.</div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4">
                                            <a
                                                href={`tel:${order.assignedDeliveryBoy.mobile}`}
                                                className="flex-1 bg-white text-zinc-900 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all"
                                            >
                                                <Phone size={14} />
                                                Call Partner
                                            </a>
                                            <button
                                                onClick={() => router.push(`/user/track-order/${order._id}`)}
                                                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-green-500 shadow-xl shadow-green-600/20 transition-all"
                                            >
                                                <Truck size={14} />
                                                Live Track
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                        <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Assigning Partner</h4>
                                            <p className="text-zinc-500 text-xs max-w-[200px] mx-auto">We're finding the best delivery partner for your batch...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Items Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Batch Contents</div>
                        <div className="text-sm font-black text-zinc-900 tracking-tighter">Total: ₹{order.totalAmount}</div>
                    </div>

                    <div className="space-y-4">
                        {Array.isArray(order?.items) && order.items.slice(0, expanded ? order.items.length : 2).map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:border-green-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-zinc-50 rounded-xl relative overflow-hidden border border-zinc-100">
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-zinc-900 text-sm leading-tight">{item.name}</h4>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.quantity} x {item.unit}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-zinc-900 tracking-tight">₹{Number(item.price) * item.quantity}</div>
                                </div>
                            </div>
                        ))}

                        {order.items.length > 2 && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="w-full py-4 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2 bg-zinc-50/50 rounded-2xl"
                            >
                                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                {expanded ? 'Show Less' : `Show ${order.items.length - 2} More Items`}
                            </button>
                        )}
                    </div>

                    {status === 'delivered' && (
                        <div className="p-6 bg-green-50 border border-green-100 rounded-[2rem] flex items-center gap-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-green-700 tracking-tight">Order Fulfilled</h4>
                                <p className="text-xs text-green-600/70 font-medium">Thank you for supporting sustainable agriculture.</p>
                            </div>
                        </div>
                    )}

                    {status === 'cancelled' && (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                                <X size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-red-700 tracking-tight">Order Cancelled</h4>
                                <p className="text-xs text-red-600/70 font-medium">This order has been cancelled by the administration.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default UserOrderCard

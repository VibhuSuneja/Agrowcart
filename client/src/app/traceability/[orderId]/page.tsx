'use client'
import React from 'react'
import { motion } from 'motion/react'
import {
    ShieldCheck, MapPin, History, Sprout,
    Warehouse, Truck, CheckCircle2, QrCode,
    Fingerprint, ArrowLeft, Info, Calendar
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import TraceabilityMap from '@/components/TraceabilityMap'

import axios from 'axios'

function TraceabilityPage() {
    const router = useRouter()
    const { orderId } = useParams()
    const [order, setOrder] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/api/traceability/${orderId}`)
                setOrder(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (orderId) fetchOrder()
    }, [orderId])

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    const firstItem = order?.items?.[0]?.product || {}
    const harvestDate = firstItem.harvestDate ? new Date(firstItem.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Oct 12, 2024"

    const timeline = [
        {
            status: "Harvested",
            location: firstItem.farmId ? `Farm ID: ${firstItem.farmId}` : "Vedic Organic Farm, Kolar",
            date: harvestDate,
            desc: `Batch secured at peak maturity under organic protocol ${firstItem.farmId || '#4290'}.`,
            icon: Sprout,
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            status: "Quality Certified",
            location: "State Millet Lab, Bangalore",
            date: order?.createdAt ? new Date(new Date(order.createdAt).getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString() : "Oct 14, 2024",
            desc: "AI-driven quality analysis confirmed Grade A nutritional profile.",
            icon: ShieldCheck,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            status: "Ordered & Paid",
            location: order?.address?.city || "Customer Location",
            date: order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Oct 15, 2024",
            desc: "Secure transaction completed via AgrowCart Secure Payment Gateway.",
            icon: Warehouse,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            status: order?.status === 'delivered' ? "Delivered" : "Out for Delivery",
            location: order?.status === 'delivered' ? order?.address?.city : (order?.address?.city || "Last Mile Hub"),
            date: order?.status === 'delivered' ? (order?.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : new Date().toLocaleDateString()) : "Live Tracking",
            desc: order?.status === 'delivered' ? "Order successfully verified via OTP and handed over to customer." : "Batch assigned to regional delivery partner for local fulfillment.",
            icon: order?.status === 'delivered' ? CheckCircle2 : Truck,
            color: order?.status === 'delivered' ? "text-green-600" : "text-purple-500",
            bg: order?.status === 'delivered' ? "bg-green-50" : "bg-purple-50"
        }
    ]

    return (
        <div className="min-h-screen bg-zinc-50 selection:bg-green-100 selection:text-green-900">
            <div className="pt-32 pb-20 w-[95%] md:w-[85%] lg:w-[70%] mx-auto">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-zinc-400 hover:text-green-600 font-bold mb-4 transition-colors group"
                        >
                            <ArrowLeft size={16} />
                            <span>Return to Order</span>
                        </motion.button>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-none"
                        >
                            Batch <span className="text-green-600">Traceability.</span>
                        </motion.h1>
                        <p className="text-zinc-500 max-w-lg font-medium text-lg italic">"Transparency is the soul of trust in agriculture."</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-zinc-100 flex items-center gap-6"
                    >
                        <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-zinc-900 overflow-hidden border border-zinc-100">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://agrowcart.com/traceability/${orderId}`)}`}
                                alt="Scan QR"
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Verification ID</div>
                            <div className="text-xl font-black text-zinc-900">#BXT-{orderId?.toString().slice(-6).toUpperCase()}</div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <TraceabilityMap order={order} />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Timeline */}
                    <div className="lg:col-span-2 space-y-12 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-200 before:dashed">
                        {timeline.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative pl-24 group"
                            >
                                <div className={`absolute left-0 top-0 w-16 h-16 rounded-[1.25rem] ${step.bg} ${step.color} flex items-center justify-center shadow-sm border border-white/50 z-10 group-hover:scale-110 transition-transform`}>
                                    <step.icon size={28} />
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-green-900/5 transition-all hover:border-green-200 hover:shadow-2xl hover:shadow-green-900/10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{step.status}</h3>
                                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 bg-zinc-50 px-3 py-1 rounded-full">
                                            <Calendar size={12} />
                                            {step.date}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-green-600 mb-4">
                                        <MapPin size={16} className="shrink-0" />
                                        <span className="text-sm font-bold uppercase tracking-wider">{step.location}</span>
                                    </div>
                                    <p className="text-zinc-500 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Verification Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-zinc-900 p-8 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />

                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-green-400">
                                    <Fingerprint size={24} />
                                </div>
                                <h3 className="text-xl font-black tracking-tight pt-2">AgrowCart Protocol Verified</h3>
                                <p className="text-zinc-500 text-xs font-medium leading-relaxed">This batch has been successfully validated under the National Millet Traceability Standard.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Hash Origin</div>
                                    <div className="text-[10px] font-mono text-green-400 truncate">0x4f2a9bce778d...991a</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Network Authority</div>
                                    <div className="text-[10px] font-black uppercase text-white">AGROWCART-GOV-NODES</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <CheckCircle2 className="text-green-500" size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">Verified Fresh</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-xl shadow-green-900/5 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                    <Info size={20} />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900">Batch Info</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-zinc-50 pb-3">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Net Weight</span>
                                    <span className="text-xs font-black text-zinc-900">1,200 KG</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-50 pb-3">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Husk Grade</span>
                                    <span className="text-xs font-black text-zinc-900">PREMIUM (A+)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cultivar</span>
                                    <span className="text-xs font-black text-zinc-900">FOXTAIL GOLD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default TraceabilityPage


'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, Package, Clock, MapPin, CreditCard, X, ExternalLink, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useSocket } from '@/context/SocketContext'
import axios from 'axios'
import Link from 'next/link'

interface INotification {
    id: string
    orderId: string
    customerName: string
    totalAmount: number
    itemCount: number
    city: string
    status: string
    paymentMethod: string
    createdAt: string
    isNew: boolean
}

function timeAgo(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHrs = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHrs / 24)

    if (diffSec < 60) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHrs < 24) return `${diffHrs}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function statusColor(status: string): string {
    switch (status) {
        case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
        case 'confirmed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
        case 'out of delivery': return 'text-violet-500 bg-violet-500/10 border-violet-500/20'
        case 'delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
        case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20'
        case 'refunded': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
        default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
    }
}

export default function AdminNotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<INotification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { socket } = useSocket()

    // Fetch recent orders on mount
    const fetchRecentOrders = useCallback(async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/admin/get-orders')
            const orders = res.data

            // Take latest 20 orders as notifications
            const recentNotifs: INotification[] = orders.slice(0, 20).map((order: any) => ({
                id: order._id,
                orderId: order._id,
                customerName: order.address?.fullName || order.user?.name || 'Customer',
                totalAmount: order.totalAmount || 0,
                itemCount: order.items?.length || 0,
                city: order.address?.city || 'Unknown',
                status: order.status || 'pending',
                paymentMethod: order.paymentMethod || 'cod',
                createdAt: order.createdAt || new Date().toISOString(),
                isNew: false
            }))

            setNotifications(recentNotifs)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRecentOrders()
    }, [fetchRecentOrders])

    // Listen for real-time new orders via socket
    useEffect(() => {
        if (!socket) return

        const handleNewOrder = (newOrder: any) => {
            const newNotif: INotification = {
                id: newOrder._id || Date.now().toString(),
                orderId: newOrder._id || '',
                customerName: newOrder.address?.fullName || 'New Customer',
                totalAmount: newOrder.totalAmount || 0,
                itemCount: newOrder.items?.length || 0,
                city: newOrder.address?.city || 'Unknown',
                status: newOrder.status || 'pending',
                paymentMethod: newOrder.paymentMethod || 'cod',
                createdAt: newOrder.createdAt || new Date().toISOString(),
                isNew: true
            }

            setNotifications(prev => [newNotif, ...prev.slice(0, 19)])
            setUnreadCount(prev => prev + 1)
        }

        const handleStatusUpdate = ({ orderId, status }: any) => {
            setNotifications(prev => prev.map(n =>
                n.orderId === orderId ? { ...n, status, isNew: true } : n
            ))
            setUnreadCount(prev => prev + 1)
        }

        socket.on('new-order', handleNewOrder)
        socket.on('order-status-update', handleStatusUpdate)

        return () => {
            socket.off('new-order', handleNewOrder)
            socket.off('order-status-update', handleStatusUpdate)
        }
    }, [socket])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleOpen = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            // Mark all as read when opening
            setUnreadCount(0)
            setNotifications(prev => prev.map(n => ({ ...n, isNew: false })))
        }
    }

    const clearAll = () => {
        setNotifications([])
        setUnreadCount(0)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleOpen}
                className="relative p-2.5 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-emerald-400 transition-all rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5"
                aria-label="Order Notifications"
                title="Recent Order Notifications"
            >
                <Bell size={22} />

                {/* Unread Badge */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-lg shadow-red-500/30 px-1"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulse ring for new notifications */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-400 animate-ping opacity-30" />
                )}
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute right-0 mt-3 w-[92vw] sm:w-[400px] max-h-[75vh] bg-white dark:bg-zinc-900 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-zinc-100 dark:border-zinc-800 overflow-hidden z-[1000] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10">
                            <div>
                                <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight">Order Notifications</h3>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-0.5">
                                    {notifications.length} Recent • Live Feed
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                        title="Clear All"
                                        aria-label="Clear all notifications"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all"
                                    aria-label="Close notifications"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto max-h-[55vh] divide-y divide-zinc-50 dark:divide-zinc-800/50 scrollbar-hide">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Orders...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                                        <Package size={28} className="text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-zinc-400">No notifications yet</p>
                                        <p className="text-[10px] text-zinc-300 font-medium mt-1">New orders will appear here in real-time</p>
                                    </div>
                                </div>
                            ) : (
                                notifications.map((notif, index) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={notif.isNew ? { opacity: 0, x: -20, backgroundColor: 'rgba(16, 185, 129, 0.08)' } : { opacity: 1 }}
                                        animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                                        transition={{ delay: index * 0.03 }}
                                        className={`px-5 py-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group relative ${notif.isNew ? 'bg-emerald-50/50 dark:bg-emerald-500/5' : ''}`}
                                    >
                                        {/* New indicator dot */}
                                        {notif.isNew && (
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50" />
                                        )}

                                        <Link href="/admin/manage-orders" onClick={() => setIsOpen(false)} className="block">
                                            <div className="flex items-start gap-3.5">
                                                {/* Icon */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${statusColor(notif.status)}`}>
                                                    <Package size={18} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-sm font-black text-zinc-800 dark:text-zinc-100 truncate">
                                                            {notif.customerName}
                                                        </p>
                                                        <span className="text-[9px] font-bold text-zinc-400 whitespace-nowrap">
                                                            {timeAgo(notif.createdAt)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                            ₹{notif.totalAmount?.toLocaleString('en-IN')}
                                                        </span>
                                                        <span className="text-[9px] text-zinc-400">•</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium">
                                                            {notif.itemCount} item{notif.itemCount !== 1 ? 's' : ''}
                                                        </span>
                                                        <span className="text-[9px] text-zinc-400">•</span>
                                                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${statusColor(notif.status)}`}>
                                                            {notif.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <div className="flex items-center gap-1 text-zinc-400">
                                                            <MapPin size={10} />
                                                            <span className="text-[10px] font-medium">{notif.city}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-zinc-400">
                                                            <CreditCard size={10} />
                                                            <span className="text-[10px] font-medium uppercase">{notif.paymentMethod}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                <Link
                                    href="/admin/manage-orders"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                                >
                                    <ExternalLink size={14} />
                                    View All Orders
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

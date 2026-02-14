'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { Users, Search, Ban, CheckCircle, ShieldCheck, Mail, Smartphone, ShieldAlert, Loader2, RefreshCw, UserCheck } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    isBanned: boolean;
    isVerified: boolean;
    mobile?: string;
}

export default function UserManagementPage() {
    const router = useRouter()
    const { userData } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        if (userData && userData.role !== 'admin') {
            router.push('/')
            toast.error("Access Denied: Administrative Clearance Required", {
                icon: '🚫',
                style: {
                    borderRadius: '1rem',
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid #ef4444'
                }
            })
        }
    }, [userData, router])

    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/admin/get-users')
            setUsers(res.data)
        } catch (error) {
            toast.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleBan = async (userId: string) => {
        try {
            const res = await axios.post('/api/admin/toggle-ban', { userId })
            toast.success(res.data.message)
            setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !u.isBanned } : u))
        } catch (error) {
            toast.error("Operation failed")
        }
    }

    const handleToggleVerify = async (userId: string) => {
        try {
            const res = await axios.post('/api/admin/toggle-verify', { userId })
            toast.success(res.data.message)
            setUsers(users.map(u => u._id === userId ? { ...u, isVerified: !u.isVerified } : u))
        } catch (error) {
            toast.error("Operation failed")
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    return (
        <div className='min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 pt-[120px]'>
            <div className='w-[95%] lg:w-[90%] mx-auto space-y-8'>

                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 px-4'>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-600 dark:text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            <Users size={14} />
                            <span>Identity & Access</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">User Management</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-xl">
                            Control platform participants, verify farmer status, and manage access permissions across the Millet ecosystem.
                        </p>
                    </div>

                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm text-zinc-600 dark:text-zinc-400 hover:text-primary transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-[2rem] shadow-xl shadow-zinc-900/5 border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {['all', 'farmer', 'shg', 'user', 'deliveryBoy', 'admin'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${roleFilter === role
                                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg"
                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Users Table/Grid */}
                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center gap-4 text-zinc-400">
                        <Loader2 size={40} className="animate-spin text-primary" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Synchronizing Hive Core...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredUsers.map((user, idx) => (
                                <motion.div
                                    key={user._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-900/5 relative overflow-hidden group hover:border-primary/20 transition-all ${user.isBanned ? 'opacity-75 grayscale' : ''}`}
                                >
                                    {/* Status Badges */}
                                    <div className="absolute top-6 right-6 flex gap-2">
                                        {user.isBanned && (
                                            <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-red-500/20">
                                                Banned
                                            </div>
                                        )}
                                        {user.role === 'admin' && (
                                            <div className="bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-500/20 flex items-center gap-1">
                                                <ShieldCheck size={10} /> Master
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden shadow-inner flex-shrink-0">
                                            {user.image ? (
                                                <Image src={user.image} alt={user.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                    <Users size={24} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="font-black text-zinc-900 dark:text-white tracking-tight">{user.name}</h3>
                                                {user.isVerified && <UserCheck size={14} className="text-blue-500" />}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                                                    <Mail size={12} /> {user.email}
                                                </div>
                                                {user.mobile && (
                                                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                                                        <Smartphone size={12} /> {user.mobile}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pt-2">
                                                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-lg text-[9px] font-black uppercase tracking-[0.1em]">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Area */}
                                    <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleToggleBan(user._id)}
                                            disabled={user.role === 'admin'}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${user.isBanned
                                                ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                                                : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                                                } disabled:opacity-30 disabled:grayscale`}
                                        >
                                            {user.isBanned ? <><CheckCircle size={14} /> Unban Access</> : <><Ban size={14} /> Ban Identity</>}
                                        </button>

                                        <button
                                            onClick={() => handleToggleVerify(user._id)}
                                            disabled={user.isBanned}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${user.isVerified
                                                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                                                } disabled:opacity-30`}
                                        >
                                            {user.isVerified ? <><ShieldCheck size={14} /> Verified</> : <><ShieldAlert size={14} /> Verify Account</>}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {filteredUsers.length === 0 && !loading && (
                    <div className="py-40 text-center glass-panel rounded-[3rem] border border-white/10 shadow-2xl">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="text-primary" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">Zero Identities Found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium">No users match your criteria. Expand your search or shift role filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import React from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import UserSidebar from '@/components/UserSidebar'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
    User,
    ShieldCheck,
    Calendar,
    MapPin,
    ChevronRight,
    Package,
    TrendingUp,
    CheckCircle2
} from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

export default function ProfilePage() {
    const { userData } = useSelector((state: RootState) => state.user)

    if (!userData) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const stats = [
        { name: 'Active Orders', value: '2', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Trust Points', value: '850', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { name: 'Verified', value: 'Official', icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-50' },
    ]

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <Nav user={userData} />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                <UserSidebar />

                <div className="flex-1 space-y-8">
                    {/* Welcome Card */}
                    <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 shadow-xl shadow-zinc-900/5 border border-zinc-100 dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-40 -mt-40" />

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative">
                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl relative group">
                                {userData.image ? (
                                    <img src={userData.image} alt={userData.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">
                                    Welcome back, <span className="text-emerald-600">{userData.name?.split(' ')[0]}</span>!
                                </h1>
                                <p className="text-zinc-500 font-medium text-lg leading-snug mb-6">
                                    {userData.bio || "AgrowCart Enthusiast • Sustainable Farmer • Nutrition Advocate"}
                                </p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="px-4 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck size={12} className="text-emerald-400" />
                                        {userData.role} Account
                                    </span>
                                    {userData.isVerified && (
                                        <span className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 size={12} />
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/settings"
                                className="px-6 py-3 bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-white/20 transition-all flex items-center gap-2"
                            >
                                Edit Profile
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.name} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 shadow-xl shadow-zinc-900/5 group hover:border-emerald-500/30 transition-all">
                                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 border border-current/10`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter mb-1">{stat.value}</div>
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.name}</div>
                            </div>
                        ))}
                    </div>

                    {/* Timeline / Recent Activity Placeholder */}
                    <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 border border-zinc-100 dark:border-white/5 shadow-xl shadow-zinc-900/5">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Recent Activity</h3>
                                <p className="text-zinc-500 text-sm font-medium">Your latest interactions on the platform.</p>
                            </div>
                            <Calendar className="text-zinc-300" size={32} />
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-zinc-50 dark:bg-white/5 rounded-3xl border border-zinc-100 dark:border-transparent group cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
                                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Price prediction for Foxtail Millet</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Today • 2:30 PM</p>
                                </div>
                                <ChevronRight className="text-zinc-300 group-hover:text-emerald-500 transition-colors" size={20} />
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-zinc-50 dark:bg-white/5 rounded-3xl border border-zinc-100 dark:border-transparent group cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                    <Package size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Order #BA772 confirmed</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Yesterday • 10:45 AM</p>
                                </div>
                                <ChevronRight className="text-zinc-300 group-hover:text-blue-500 transition-colors" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

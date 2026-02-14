'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    User,
    Settings,
    Package,
    Heart,
    MessageSquare,
    ShieldCheck,
    LogOut,
    UtensilsCrossed,
    MapPin
} from 'lucide-react'
import { motion } from 'motion/react'
import { signOut } from 'next-auth/react'

const sidebarItems = [
    { name: 'Profile Overview', href: '/profile', icon: User },
    { name: 'Account Settings', href: '/settings', icon: Settings },
    { name: 'My Orders', href: '/user/my-orders', icon: Package },
    { name: 'Saved Recipes', href: '/user/recipes', icon: UtensilsCrossed },
    // { name: 'Addresses', href: '/user/addresses', icon: MapPin },
    { name: 'Community', href: '/community', icon: MessageSquare },
]

export default function UserSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-4">
                <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-4 shadow-xl shadow-zinc-900/5 border border-zinc-100 dark:border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16" />

                    <nav className="space-y-1 relative">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${isActive
                                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl shadow-zinc-900/20'
                                            : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} className={`${isActive ? 'text-emerald-400 dark:text-emerald-600' : 'text-zinc-400 group-hover:text-emerald-500'} transition-colors`} />
                                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-600"
                                        />
                                    )}
                                </Link>
                            )
                        })}

                        <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-white/5">
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                            >
                                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                                <span className="font-bold text-sm tracking-tight">Sign Out</span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Helpful Card */}
                <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/20 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                    <ShieldCheck size={40} className="mb-4 opacity-50" />
                    <h4 className="text-lg font-black tracking-tight mb-2 leading-tight">Trust Standard verified.</h4>
                    <p className="text-emerald-100 text-xs font-medium leading-relaxed opacity-80">Your data is secured with AES-256 encryption and biometric AgrowCart access keys.</p>
                </div>
            </div>
        </aside>
    )
}

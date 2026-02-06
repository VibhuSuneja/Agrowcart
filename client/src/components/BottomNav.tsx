'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingCart, User, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Market', icon: Search, href: '/marketplace' },
    { label: 'Cart', icon: ShoppingCart, href: '/user/cart', badge: true },
    { label: 'Forum', icon: MessageSquare, href: '/community/forum' },
    { label: 'Profile', icon: User, href: '/profile' }
]

export default function BottomNav() {
    const pathname = usePathname()
    const cartData = useSelector((state: RootState) => state.cart.cartData || [])

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 glass-panel rounded-3xl border border-white/20 shadow-2xl z-[90] flex items-center justify-around px-2 backdrop-blur-3xl bg-white/40 dark:bg-emerald-950/40">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "relative flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-2xl transition-all duration-300",
                            isActive ? "text-primary bg-primary/10" : "text-zinc-500 dark:text-zinc-400"
                        )}
                    >
                        <Icon size={20} className={cn(isActive && "scale-110")} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                        {item.badge && cartData.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-background-dark">
                                {cartData.length}
                            </span>
                        )}
                        {isActive && (
                            <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                        )}
                    </Link>
                )
            })}
        </div>
    )
}

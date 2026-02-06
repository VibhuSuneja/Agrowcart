'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingCart, User, MessageSquare, LayoutDashboard, Database, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export default function BottomNav() {
    const pathname = usePathname()
    const { userData } = useSelector((state: RootState) => state.user)
    const { cartData } = useSelector((state: RootState) => state.cart)

    // Only show on mobile
    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-[72px] glass-panel rounded-[2rem] border border-white/10 shadow-2xl z-50 flex items-center justify-around px-2">
            <NavItem
                href="/"
                icon={LayoutDashboard}
                label="Home"
                isActive={pathname === '/'}
            />
            <NavItem
                href="/marketplace"
                icon={Search}
                label="Market"
                isActive={pathname === '/marketplace'}
            />
            <NavItem
                href="/user/cart"
                icon={ShoppingCart}
                label="Cart"
                isActive={pathname === '/user/cart'}
                badge={cartData.length}
            />
            <NavItem
                href="/profile"
                icon={User}
                label="Profile"
                isActive={pathname === '/profile'}
            />
        </div>
    )
}

function NavItem({ href, icon: Icon, label, isActive, badge }: { href: string, icon: any, label: string, isActive: boolean, badge?: number }) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center gap-1 w-16 relative group transition-all duration-300">
            {isActive && (
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-50 scale-150" />
            )}
            <div className={cn(
                "p-2 rounded-full transition-all duration-300 relative",
                isActive ? "text-primary scale-110" : "text-zinc-500 dark:text-zinc-400 group-hover:text-white"
            )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {badge ? (
                    <span className="absolute -top-1 -right-1 size-4 bg-primary text-background-dark text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background-dark">
                        {badge}
                    </span>
                ) : null}
            </div>
            <span className={cn(
                "text-[10px] font-bold transition-all duration-300",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            )}>
                {label}
            </span>
            {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#11d462]" />
            )}
        </Link>
    )
}

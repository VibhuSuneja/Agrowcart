'use client'
import { Boxes, ClipboardCheck, Cross, Leaf, LogOut, Menu, Package, Plus, PlusCircle, Search, ShoppingCartIcon, User, X, ChefHat, TrendingUp, MessageSquare, Trash2, ArrowLeft } from 'lucide-react'

import Link from 'next/link'
import toast from 'react-hot-toast'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter, usePathname } from 'next/navigation'
import GoogleTranslator from './GoogleTranslator'
import TextToSpeech from './TextToSpeech'
import GlobalCallListener from './GlobalCallListener'
import { useTranslations } from '@/i18n/LanguageProvider'
import { orbitron } from '@/lib/fonts'

interface IUser {
    _id?: string
    name: string
    email: string
    password?: string
    mobile?: string
    role: "user" | "deliveryBoy" | "admin" | "farmer" | "shg" | "buyer" | "startup" | "processor"
    image?: string
}
function Nav({ user: propUser }: { user: any }) {
    const user = propUser || { name: 'Guest', email: '', role: 'user', image: null };
    const [open, setOpen] = useState(false)
    const profileDropDown = useRef<HTMLDivElement>(null)
    const [searchBarOpen, setSearchBarOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { cartData } = useSelector((state: RootState) => state.cart)
    const [search, setSearch] = useState("")
    const router = useRouter()
    const pathname = usePathname()
    const t = useTranslations('common')
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileDropDown.current && !profileDropDown.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])



    const handleSearch = (e: FormEvent) => {
        e.preventDefault()
        const query = search.trim()
        if (!query) {
            return router.push("/")
        }

        router.push(`/?q=${encodeURIComponent(query)}`)
        setSearch("")
        setSearchBarOpen(false)
    }

    const sideBar = menuOpen ? createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className='fixed top-0 left-0 h-full w-[85%] sm:w-[50%] md:w-[40%] z-[9999]
              bg-white/95 backdrop-blur-3xl border-r border-zinc-200
              shadow-[0_0_100px_rgba(0,0,0,0.2)]
              flex flex-col text-zinc-800'
            >
                {/* Header with User Profile */}
                <div className='bg-linear-to-br from-green-600 to-emerald-800 p-6 pb-12 pt-12 relative overflow-hidden'>
                    <div className='absolute top-0 left-0 w-full h-full opacity-20'>
                        <Leaf className='w-48 h-48 absolute -right-10 -top-10 text-white rotate-12' />
                    </div>

                    <div className='relative z-10 flex items-center gap-4'>
                        <div className='w-16 h-16 rounded-2xl border-4 border-white/20 shadow-xl overflow-hidden bg-white'>
                            {user.image ? <Image src={user.image} alt='user' fill className='object-cover' /> : <div className='w-full h-full flex items-center justify-center bg-zinc-100'><User className='text-zinc-400' /></div>}
                        </div>
                        <div>
                            <h2 className='text-xl font-bold text-white tracking-tight leading-tight'>{user.name}</h2>
                            <div className='flex items-center gap-2 mt-1'>
                                <span className='px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md'>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        className='absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all'
                        onClick={() => setMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Menu Items */}
                <div className='flex-1 overflow-y-auto py-6 px-4 space-y-2'>
                    <p className='px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2'>Explore</p>

                    <Link href="/" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-50 active:bg-green-50 active:text-green-700 transition-all font-semibold text-zinc-600' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center'><TrendingUp size={18} /></div>
                        Home
                    </Link>
                    <Link href="/recipes" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-50 active:bg-green-50 active:text-green-700 transition-all font-semibold text-zinc-600' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center'><ChefHat size={18} /></div>
                        Community Recipes
                    </Link>
                    <Link href="/community/forum" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-50 active:bg-green-50 active:text-green-700 transition-all font-semibold text-zinc-600' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center'><MessageSquare size={18} /></div>
                        Discussion Forum
                    </Link>

                    {user.role === 'user' && (
                        <>
                            <div className='my-4 border-t border-zinc-100'></div>
                            <p className='px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2'>Personal</p>
                            <Link href="/user/cart" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-50 active:bg-green-50 active:text-green-700 transition-all font-semibold text-zinc-600' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center'><ShoppingCartIcon size={18} /></div>
                                My Cart
                                {cartData.length > 0 && <span className='ml-auto bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full'>{cartData.length}</span>}
                            </Link>
                            <Link href="/user/my-orders" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-50 active:bg-green-50 active:text-green-700 transition-all font-semibold text-zinc-600' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center'><Package size={18} /></div>
                                My Orders
                            </Link>
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <div className='my-4 border-t border-zinc-100'></div>
                            <p className='px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2'>Admin Controls</p>
                            <Link href="/admin/add-product" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-50 transition-all font-semibold text-zinc-600' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center'><PlusCircle size={18} /></div>
                                Add Product
                            </Link>
                            <Link href="/admin/view-products" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-50 transition-all font-semibold text-zinc-600' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center'><Boxes size={18} /></div>
                                View Products
                            </Link>
                            <Link href="/admin/manage-orders" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-50 transition-all font-semibold text-zinc-600' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center'><ClipboardCheck size={18} /></div>
                                Manage Orders
                            </Link>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className='p-4 border-t border-zinc-100 bg-zinc-50/50 space-y-3'>
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                try {
                                    const res = await fetch('/api/user/delete-account', { method: 'DELETE' });
                                    const data = await res.json();
                                    if (res.ok) {
                                        toast.success("Account deleted successfully.");
                                        setTimeout(() => signOut({ callbackUrl: "/" }), 2000);
                                    } else {
                                        toast.error(data.message || "Failed to delete account.");
                                    }
                                } catch (error) {
                                    toast.error("An error occurred. Please try again.");
                                }
                            }
                        }}
                        className='flex items-center gap-3 w-full p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-sm border border-red-200'
                    >
                        <Trash2 size={18} />
                        Delete My Account
                    </button>
                    <button
                        onClick={async () => {
                            setMenuOpen(false);
                            await signOut({ callbackUrl: "/" });
                        }}
                        className='flex items-center gap-3 w-full p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all'
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                    <div className='text-center mt-4 text-[10px] text-zinc-400 font-semibold uppercase tracking-widest'>
                        AgrowCart v2.0
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-black/20 backdrop-blur-sm z-[9990]'
                onClick={() => setMenuOpen(false)}
            />
        </AnimatePresence>,
        document.body
    ) : null


    return (
        <nav className='sticky top-0 left-0 w-full bg-white/70 dark:bg-background-dark/80 backdrop-blur-2xl transition-all duration-300 z-[100] border-b border-zinc-200/50 dark:border-white/5 h-20 px-4 md:px-10 flex items-center justify-between'>

            <div className='flex items-center gap-4'>
                <button
                    onClick={() => setMenuOpen(true)}
                    className='p-2.5 text-zinc-600 dark:text-zinc-400 lg:hidden rounded-2xl bg-zinc-100 dark:bg-white/5 active:scale-90 transition-all'
                    aria-label="Open Menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Logo Area */}
                <Link href={"/"} className='flex items-center gap-3 group transition-all duration-500'>
                    <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-500">
                        <Leaf className="text-white w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`${orbitron.className} text-slate-900 dark:text-white font-black text-xl tracking-tighter leading-none`}>
                            Agro<span className="text-primary">w</span>Cart
                        </span>
                        <span className="text-[9px] text-zinc-400 dark:text-emerald-400/60 font-black tracking-[0.2em] uppercase leading-none mt-1">AI Precision</span>
                    </div>
                </Link>
            </div>

            {/* Desktop Center Search */}
            {user.role === "user" && (
                <div className="hidden lg:block flex-1 max-w-xl px-10">
                    <form className='relative group' onSubmit={handleSearch}>
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className='text-zinc-400 group-focus-within:text-primary transition-colors w-4 h-4' />
                        </div>
                        <input
                            type="text"
                            placeholder='Search premium millets & products...'
                            className='w-full bg-zinc-100 dark:bg-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all border border-transparent focus:border-primary/20 text-slate-800 dark:text-white'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>
            )}

            <div className='flex items-center gap-3 md:gap-4'>
                {/* Desktop Quick Actions */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link href="/recipes" className="p-3 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors" title="Recipes">
                        <ChefHat size={22} />
                    </Link>
                    <Link href="/community/forum" className="p-3 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors" title="Forum">
                        <MessageSquare size={22} />
                    </Link>
                    {/* Google Translate Widget */}
                    <div className="scale-75 origin-right">
                        <GoogleTranslator />
                    </div>
                    {/* Text to Speech Tool */}
                    <TextToSpeech />
                </div>

                <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-2 hidden lg:block"></div>

                {user.role === "user" && (
                    <Link href="/user/cart" className='relative p-3 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 rounded-2xl hover:scale-105 active:scale-95 transition-all'>
                        <ShoppingCartIcon size={22} />
                        {cartData.length > 0 && (
                            <span className='absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg border-2 border-white dark:border-background-dark'>
                                {cartData.length}
                            </span>
                        )}
                    </Link>
                )}

                {/* Profile Trigger */}
                <div className='relative' ref={profileDropDown}>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        className='p-1 bg-white/10 dark:bg-white/5 rounded-2xl cursor-pointer border border-zinc-200/50 dark:border-white/10 hover:border-primary/50 transition-all flex items-center gap-3 pr-4'
                        onClick={() => setOpen(prev => !prev)}
                    >
                        <div className='w-10 h-10 relative overflow-hidden rounded-xl border border-white/20 shadow-sm'>
                            {user.image ? <Image src={user.image} alt='' fill className='object-cover' /> : <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><User className="text-zinc-400" /></div>}
                        </div>
                        <div className="hidden xl:block text-left">
                            <p className="text-xs font-black text-slate-800 dark:text-white line-clamp-1 leading-none mb-1">{user.name}</p>
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">{user.role}</p>
                        </div>
                        <Plus size={16} className={cn("text-zinc-400 transition-transform duration-300", open ? "rotate-45" : "")} />
                    </motion.div>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className='absolute right-0 mt-4 w-72 glass-panel rounded-[2rem] shadow-2xl border border-white/20 p-4 z-[1000] overflow-hidden'
                            >
                                <div className='flex items-center gap-4 p-4 mb-4 bg-primary/10 dark:bg-white/5 rounded-[1.5rem] border border-primary/10'>
                                    <div className='w-12 h-12 relative rounded-xl bg-white shadow-lg overflow-hidden flex items-center justify-center ring-2 ring-primary/20'>
                                        {user.image ? <Image src={user.image} alt='user' fill className='object-cover' /> : <User className="text-primary" />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className='text-zinc-900 dark:text-white font-black truncate text-sm'>{user.name}</div>
                                        <div className='text-[10px] text-primary font-black uppercase tracking-[0.2em]'>{user.role} Hub</div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 px-1">
                                    {(['farmer', 'shg', 'processor'].includes(user.role)) && (
                                        <Link href={`/${user.role}-dashboard`} className='flex items-center gap-4 px-4 py-3 hover:bg-primary/10 rounded-xl text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest transition-all' onClick={() => setOpen(false)}>
                                            <TrendingUp size={18} className='text-primary' />
                                            Dashboard
                                        </Link>
                                    )}

                                    <Link href={"/marketplace"} className='flex items-center gap-4 px-4 py-3 hover:bg-primary/10 rounded-xl text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest transition-all' onClick={() => setOpen(false)}>
                                        <Package size={18} className='text-primary' />
                                        Marketplace
                                    </Link>

                                    <div className="my-2 h-px bg-zinc-100 dark:bg-white/5"></div>

                                    <button
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                        className='flex items-center gap-4 w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-red-600 font-bold text-xs uppercase tracking-widest transition-all'
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Search Overlay Toggle */}
            <AnimatePresence>
                {searchBarOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-0 w-full px-4 py-6 bg-white/90 dark:bg-background-dark/90 backdrop-blur-3xl z-40 lg:hidden shadow-2xl"
                    >
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                            <input
                                type="text"
                                placeholder='Search products...'
                                className='w-full h-14 bg-zinc-100 dark:bg-white/5 rounded-2xl pl-12 pr-12 text-lg font-bold outline-none border-2 border-transparent focus:border-primary/20 text-slate-900 dark:text-white'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                            <button type="button" onClick={() => setSearchBarOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                                <X size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {sideBar}
            {user?._id && <GlobalCallListener userId={user._id} role={user.role} />}
        </nav>
    )
}

export default Nav

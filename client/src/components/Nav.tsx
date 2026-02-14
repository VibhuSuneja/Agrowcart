'use client'
import { Boxes, ClipboardCheck, Cross, Leaf, LogOut, Menu, Package, Plus, PlusCircle, Search, ShoppingCartIcon, User, X, ChefHat, TrendingUp, MessageSquare, Trash2, ArrowLeft, ArrowRight, Settings, Sparkles, ShieldCheck, Scale, Gavel } from 'lucide-react'

import Link from 'next/link'
import toast from 'react-hot-toast'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter, usePathname } from 'next/navigation'
import GoogleTranslator from './GoogleTranslator'
import TextToSpeech from './TextToSpeech'
import GlobalCallListener from './GlobalCallListener'
import { useTranslations } from '@/i18n/LanguageProvider'
import { orbitron } from '@/lib/fonts'
import PWAInstallButton from './PWAInstallButton'
import AdminNotificationBell from './AdminNotificationBell'

interface IUser {
    _id?: string
    name: string
    email: string
    password?: string
    mobile?: string
    role: "user" | "deliveryBoy" | "admin" | "farmer" | "shg" | "buyer" | "startup" | "processor"
    image?: string
    status?: "online" | "away" | "dnd"
    isVerified?: boolean
    isBanned?: boolean
    bio?: string
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
        const targetPath = pathname === '/marketplace' ? '/marketplace' : '/'

        if (!query) {
            return router.push(targetPath)
        }

        router.push(`${targetPath}?q=${encodeURIComponent(query)}`)
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
              bg-[#0b1613]/95 backdrop-blur-3xl border-r border-white/10
              shadow-[0_0_100px_rgba(0,0,0,0.5)]
              flex flex-col text-white'
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
                            <div className='flex items-center gap-1.5'>
                                <h2 className='text-xl font-bold text-white tracking-tight leading-tight'>{user.name}</h2>
                                {user.isVerified && <ShieldCheck size={16} className="text-blue-400 fill-blue-400" />}
                            </div>
                            <div className='flex items-center gap-2 mt-1'>
                                <span className='px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md'>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 lg:hidden">
                        <div className="scale-90 origin-left">
                            <GoogleTranslator />
                        </div>
                        <TextToSpeech />
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

                    <Link href="/" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center'><TrendingUp size={18} /></div>
                        Home
                    </Link>
                    <Link href="/recipes" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center'><ChefHat size={18} /></div>
                        Community Recipes
                    </Link>
                    <Link href="/community/forum" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center'><MessageSquare size={18} /></div>
                        Discussion Forum
                    </Link>
                    <Link href="/marketplace" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center'><Boxes size={18} /></div>
                        Marketplace
                    </Link>
                    <Link href="/tools/crop-doctor" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center'><PlusCircle size={18} /></div>
                        AI Crop Doctor
                    </Link>
                    <Link href="/logistics" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center'><Package size={18} /></div>
                        Logistics
                    </Link>
                    <Link href="/shree-anna" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-amber-500/10 active:text-amber-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                        <div className='w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center'><Sparkles size={18} /></div>
                        Shree Anna
                    </Link>

                    {['farmer', 'shg', 'processor', 'startup'].includes(user.role) && (
                        <Link href="/tools/contract-hub" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                            <div className='w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center'><Scale size={18} /></div>
                            Institutional Contract Hub
                        </Link>
                    )}

                    <button
                        onClick={() => {
                            const roleMap: { [key: string]: string } = {
                                'farmer': 'farmer_v1',
                                'processor': 'processor_v1',
                                'shg': 'shg_v1',
                                'startup': 'startup_v1',
                                'user': 'consumer_v1',
                                'buyer': 'buyer_v1',
                                'deliveryBoy': 'delivery_v1'
                            }
                            if (roleMap[user.role]) {
                                localStorage.removeItem(`tour_${roleMap[user.role]}`)
                                window.location.reload()
                            }
                        }}
                        className='flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all font-semibold text-primary text-left'
                    >
                        <div className='w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center'><TrendingUp size={18} /></div>
                        Re-Take Tour
                    </button>

                    {user.role === 'user' && (
                        <>
                            <div className='my-4 border-t border-zinc-100'></div>
                            <p className='px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2'>Personal</p>
                            <Link href="/user/cart" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center'><ShoppingCartIcon size={18} /></div>
                                My Cart
                                {cartData.length > 0 && <span className='ml-auto bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full'>{cartData.length}</span>}
                            </Link>
                            <Link href="/user/my-orders" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center'><Package size={18} /></div>
                                My Orders
                            </Link>
                            <Link href="/profile" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-zinc-500/10 text-zinc-400 flex items-center justify-center'><User size={18} /></div>
                                My Profile
                            </Link>
                            <Link href="/settings" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-zinc-500/10 text-zinc-400 flex items-center justify-center'><Settings size={18} /></div>
                                Settings
                            </Link>
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <div className='my-4 border-t border-zinc-100'></div>
                            <p className='px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2'>Admin Controls</p>
                            <Link href="/admin/add-product" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center'><PlusCircle size={18} /></div>
                                Add Product
                            </Link>
                            <Link href="/admin/view-products" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center'><Boxes size={18} /></div>
                                View Products
                            </Link>
                            <Link href="/admin/manage-orders" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center'><ClipboardCheck size={18} /></div>
                                Manage Orders
                            </Link>
                        </>
                    )}

                    {user.role === 'deliveryBoy' && (
                        <>
                            <div className='my-4 border-t border-zinc-100'></div>
                            <p className='px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2'>Logistics Hub</p>
                            <Link href="/delivery-dashboard" className='flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-green-500/10 active:text-green-400 transition-all font-semibold text-zinc-300' onClick={() => setMenuOpen(false)}>
                                <div className='w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center'><Package size={18} /></div>
                                Delivery Dashboard
                            </Link>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className='p-4 border-t border-white/5 bg-white/5 space-y-3'>
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
                        className='flex items-center gap-3 w-full p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all text-sm border border-red-500/20'
                    >
                        <Trash2 size={18} />
                        Delete My Account
                    </button>
                    <button
                        onClick={async () => {
                            setMenuOpen(false);
                            await signOut({ callbackUrl: "/" });
                        }}
                        className='flex items-center gap-3 w-full p-4 rounded-2xl bg-white/5 text-zinc-300 font-bold hover:bg-white/10 transition-all'
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                    <div className='text-center mt-4 text-[10px] text-zinc-500 font-semibold uppercase tracking-widest'>
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
        <nav className='w-full fixed top-0 left-0 glass-header h-20 px-6 md:px-10 z-[100] transition-all duration-300 flex justify-between items-center'>

            <div className='flex items-center gap-4'>
                <button
                    onClick={() => setMenuOpen(true)}
                    className='p-2 -ml-2 text-zinc-600 dark:text-zinc-300 lg:hidden rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors'
                    aria-label="Open Menu"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Back Button */}
                {pathname !== "/" && (
                    <button
                        onClick={() => router.back()}
                        className='p-2 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-white/10 transition-all flex items-center justify-center group'
                    >
                        <ArrowLeft className='w-5 h-5 group-hover:-translate-x-0.5 transition-transform' />
                    </button>
                )}

                <Link href={"/"} className='flex items-center gap-3 group'>
                    <div className="w-10 h-10 md:w-11 md:h-11 bg-primary rounded-xl flex items-center justify-center shadow-lg agrow-glow group-hover:scale-105 transition-all duration-500">
                        <Leaf className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`${orbitron.className} text-zinc-800 dark:text-white font-black text-lg md:text-xl tracking-tight group-hover:tracking-normal transition-all duration-300`}>
                            Agro<span className="relative">w<TrendingUp className="absolute -top-3.5 left-0 w-4 h-4 text-primary" /></span><span className="text-primary">Cart</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase hidden sm:block">Modern Organic Precision</span>
                            <Link href="/shree-anna" className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md hover:bg-amber-500/20 transition-all cursor-pointer">
                                <Sparkles size={8} className="text-amber-500 animate-pulse" />
                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Shree Anna</span>
                            </Link>
                            {['farmer', 'shg', 'processor', 'startup'].includes(user.role) && (
                                <Link href="/tools/contract-hub" className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-all cursor-pointer">
                                    <Gavel size={8} className="text-primary animate-pulse" />
                                    <span className="text-[8px] font-black text-primary uppercase tracking-widest">Contract Hub</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Desktop Navigation Tools */}
            <div className='hidden lg:flex items-center gap-2 flex-1 justify-center max-w-2xl px-6'>
                {user.role === "user" && (
                    <form className='relative w-full flex items-center' onSubmit={handleSearch}>
                        <div className="relative w-full">
                            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4' />
                            <input
                                type="text"
                                placeholder='Search organic harvests...'
                                className='w-full bg-zinc-100 dark:bg-white/5 rounded-2xl pl-11 pr-14 py-2.5 text-sm font-medium outline-none border border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-zinc-800 transition-all shadow-sm'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-md agrow-glow"
                            >
                                <Search size={14} />
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className='flex items-center gap-2 md:gap-4'>
                <div className="hidden lg:flex items-center gap-1">
                    {user.role === 'user' && (
                        <Link href="/user/cart" className="relative p-3 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-emerald-400 transition-all group" title="My Cart">
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 group-hover:scale-110 transition-transform">
                                {cartData.length}
                            </div>
                            <ShoppingCartIcon size={22} />
                        </Link>
                    )}
                    {user.role === 'user' && (
                        <Link href="/user/my-orders" className="p-3 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors" title="My Orders">
                            <Package size={22} />
                        </Link>
                    )}
                    <Link href="/recipes" className="p-3 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors" title="Recipes">
                        <ChefHat size={22} />
                    </Link>
                    <Link href="/shree-anna" className="p-3 text-zinc-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors" title="Shree Anna Hub">
                        <Sparkles size={22} />
                    </Link>
                    <Link href="/community/forum" className="p-3 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors" title="Forum">
                        <MessageSquare size={22} />
                    </Link>
                    {['farmer', 'shg', 'processor', 'startup'].includes(user.role) && (
                        <Link href="/tools/contract-hub" className="p-3 text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors" title="Institutional Contract Hub">
                            <Gavel size={22} />
                        </Link>
                    )}
                    <div className="scale-75 origin-right">
                        <GoogleTranslator />
                    </div>
                    <TextToSpeech />
                </div>

                <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1 hidden lg:block"></div>

                {user.role === 'user' && (
                    <button
                        onClick={() => setSearchBarOpen(!searchBarOpen)}
                        className='p-2 text-zinc-600 dark:text-zinc-300 lg:hidden rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors relative z-[110]'
                        aria-label="Search"
                    >
                        {searchBarOpen ? <X size={22} /> : <Search size={22} />}
                    </button>
                )}

                <PWAInstallButton />

                {/* Admin Order Notification Bell */}
                {user.role === 'admin' && <AdminNotificationBell />}

                <div className='relative' ref={profileDropDown}>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        className='p-[2px] rounded-2xl cursor-pointer bg-linear-to-br from-primary to-primary-dark shadow-lg shadow-primary/10'
                        onClick={() => setOpen(!open)}
                    >
                        <div className='bg-white dark:bg-background-dark rounded-[14px] w-10 h-10 relative overflow-hidden flex items-center justify-center'>
                            {user.image ? (
                                <Image src={user.image} alt='profile' fill className='object-cover' />
                            ) : (
                                <User className="text-primary w-5 h-5" />
                            )}
                        </div>
                        {user.status && (
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${user.status === 'online' ? 'bg-emerald-500' : user.status === 'away' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        )}
                    </motion.div>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className='absolute right-0 mt-4 w-72 glass-panel rounded-[2rem] shadow-2xl p-4 z-[1000] border border-white/20'
                            >
                                <Link href="/profile" className='flex items-center gap-4 p-4 mb-4 bg-primary/10 dark:bg-white/5 rounded-[1.5rem] border border-primary/10 hover:bg-primary/20 transition-all cursor-pointer group/profile' onClick={() => setOpen(false)}>
                                    <div className='w-12 h-12 relative rounded-xl bg-white shadow-lg overflow-hidden flex items-center justify-center group-hover/profile:scale-105 transition-transform'>
                                        {user.image ? <Image src={user.image} alt='user' fill className='object-cover' /> : <User className="text-primary" />}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1">
                                        {user.status && (
                                            <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm ${user.status === 'online' ? 'bg-emerald-500' : user.status === 'away' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className='flex items-center gap-1.5 text-zinc-900 dark:text-white font-black truncate text-sm'>
                                            {user.name}
                                            {user.isVerified && <ShieldCheck size={12} className="text-blue-500 fill-blue-500" />}
                                        </div>
                                        <div className='text-[10px] text-primary font-black uppercase tracking-[0.2em] group-hover/profile:translate-x-1 transition-transform'>View Profile</div>
                                    </div>
                                </Link>

                                <div className="space-y-1.5">
                                    {['farmer', 'shg', 'processor'].includes(user.role) && (
                                        <Link href={`/${user.role}-dashboard`} className='flex items-center gap-4 px-4 py-3 hover:bg-primary/10 rounded-xl text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest transition-all' onClick={() => setOpen(false)}>
                                            <TrendingUp size={18} className='text-primary' />
                                            Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => {
                                            const roleMap: { [key: string]: string } = {
                                                'farmer': 'farmer_v1',
                                                'processor': 'processor_v1',
                                                'shg': 'shg_v1',
                                                'startup': 'startup_v1',
                                                'user': 'consumer_v1',
                                                'buyer': 'buyer_v1',
                                                'deliveryBoy': 'delivery_v1'
                                            }
                                            if (roleMap[user.role]) {
                                                localStorage.removeItem(`tour_${roleMap[user.role]}`)
                                                window.location.reload()
                                            }
                                        }}
                                        className='flex items-center gap-4 w-full px-4 py-3 hover:bg-primary/10 rounded-xl text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest transition-all text-left'
                                    >
                                        <div className='w-5 flex justify-center'><TrendingUp size={18} className='text-primary' /></div>
                                        Re-Take Tour
                                    </button>

                                    {user.role === 'user' && (
                                        <Link href="/user/my-orders" className='flex items-center gap-4 w-full px-4 py-3 hover:bg-primary/10 rounded-xl text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest transition-all text-left' onClick={() => setOpen(false)}>
                                            <div className='w-5 flex justify-center'><Package size={18} className='text-primary' /></div>
                                            My Orders
                                        </Link>
                                    )}

                                    <Link href="/settings" className='flex items-center gap-4 w-full px-4 py-3 hover:bg-primary/10 rounded-xl text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest transition-all text-left' onClick={() => setOpen(false)}>
                                        <Settings size={18} className='text-primary' />
                                        Settings
                                    </Link>

                                    <div className="h-px bg-zinc-100 dark:bg-white/5 my-2"></div>

                                    <button
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                        className='flex items-center gap-4 w-full px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-red-600 font-bold text-xs uppercase tracking-widest transition-all text-left'
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>

                                    <button
                                        onClick={async () => {
                                            if (window.confirm("CRITICAL: Are you sure you want to delete your account? This action cannot be undone and you will lose all order history.")) {
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
                                        className='flex items-center gap-4 w-full px-4 py-3 hover:bg-red-500/10 group rounded-xl text-red-500 font-bold text-xs uppercase tracking-widest transition-all text-left mt-1'
                                    >
                                        <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                                        Delete Account
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {searchBarOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-0 w-full bg-white dark:bg-[#0b1613] border-b border-zinc-100 dark:border-white/10 p-4 lg:hidden shadow-2xl z-[90]"
                    >
                        <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search organic harvests..."
                                className="w-full bg-zinc-100 dark:bg-white/5 rounded-2xl pl-11 pr-14 py-3.5 text-sm font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Triggered by setMenuOpen */}
            {sideBar}
            {user?._id && <GlobalCallListener userId={user._id} role={user.role} />}
        </nav>
    )
}

export default Nav

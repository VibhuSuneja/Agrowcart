'use client'
import { Boxes, ClipboardCheck, Cross, Leaf, LogOut, Menu, Package, Plus, PlusCircle, Search, ShoppingCartIcon, User, X, ChefHat, TrendingUp, MessageSquare, Trash2, ArrowLeft } from 'lucide-react'

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
        <nav className='w-full absolute top-0 left-0 bg-white/80 backdrop-blur-xl shadow-sm shadow-green-900/5 flex justify-between items-center h-20 px-6 md:px-10 z-50 border-b border-zinc-200 transition-all duration-300'>

            <div className='flex items-center gap-2 lg:gap-0'>
                <button
                    onClick={() => setMenuOpen(true)}
                    className='p-2 -ml-2 text-zinc-600 lg:hidden rounded-xl active:bg-zinc-100 transition-colors'
                    aria-label="Open Menu"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Back Button - visible on all pages except home */}
                {pathname !== "/" && (
                    <button
                        onClick={() => router.back()}
                        className='mr-2 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-all flex items-center justify-center shadow-sm group'
                        title="Go Back"
                        aria-label="Navigate to previous page"
                    >
                        <ArrowLeft className='w-5 h-5 group-hover:-translate-x-0.5 transition-transform' />
                    </button>
                )}

                <Link href={"/"} className='flex items-center gap-3 group hover:-translate-y-0.5 transition-transform duration-300'>
                    <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:shadow-2xl group-hover:shadow-green-500/50 group-hover:from-green-400 group-hover:to-emerald-500 transition-all duration-500">
                        <Leaf className="text-white w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`${orbitron.className} text-zinc-800 font-black text-lg md:text-xl sm:text-2xl tracking-tight group-hover:tracking-normal transition-all duration-300`}>
                            Agro<span className="relative inline-block">
                                w
                                <TrendingUp className="absolute -top-3.5 left-0 w-4 h-4 text-green-500 group-hover:text-emerald-400 group-hover:-translate-y-0.5 group-hover:scale-110 transition-all duration-300" />
                            </span><span className="text-green-600 group-hover:text-emerald-500 transition-colors duration-300">Cart</span>
                        </span>
                        <span className="text-[8px] md:text-[10px] text-zinc-400 font-medium tracking-widest uppercase group-hover:text-green-600 transition-colors duration-300 hidden sm:block">Farm to Fork</span>
                    </div>
                </Link>
            </div>

            {user.role == "user" && (
                <form className='hidden lg:flex items-center bg-zinc-100 rounded-2xl px-5 py-2.5 w-1/3 max-w-lg focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 focus-within:shadow-inner transition-all duration-300 border border-transparent focus-within:border-green-100' onSubmit={handleSearch}>
                    <Search className='text-zinc-400 w-5 h-5 mr-3' />
                    <input
                        type="text"
                        placeholder='Search the marketplace...'
                        className='w-full outline-none text-zinc-700 placeholder-zinc-400 bg-transparent font-medium text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            )}

            <div className='flex items-center gap-2 md:gap-4 relative'>
                {/* Community Recipes - visible to everyone */}
                <Link href={"/recipes"} className='relative bg-zinc-100 rounded-xl w-10 h-10 md:w-11 md:h-11 flex items-center justify-center shadow-sm hover:bg-white hover:ring-2 hover:ring-green-500/20 transition group' title="Community Recipes" aria-label="Explore Community Recipes">
                    <ChefHat className='text-zinc-600 w-4 h-4 md:w-5 md:h-5 group-hover:text-green-600 transition-colors' aria-hidden="true" />
                </Link>

                {/* Forum - visible to everyone */}
                <Link href={"/community/forum"} className='relative bg-zinc-100 rounded-xl w-10 h-10 md:w-11 md:h-11 flex items-center justify-center shadow-sm hover:bg-white hover:ring-2 hover:ring-green-500/20 transition group' title="Discussion Forum" aria-label="Join Discussion Forum">
                    <MessageSquare className='text-zinc-600 w-4 h-4 md:w-5 md:h-5 group-hover:text-green-600 transition-colors' aria-hidden="true" />
                </Link>

                {user.role == "user" && (
                    <>
                        <div className='bg-zinc-100 rounded-xl w-11 h-11 flex items-center justify-center shadow-sm hover:bg-white hover:ring-2 hover:ring-green-500/20 transition lg:hidden cursor-pointer' onClick={() => setSearchBarOpen((prev) => !prev)}>
                            {searchBarOpen ? <X className='text-zinc-600 w-5 h-5' /> : <Search className='text-zinc-600 w-5 h-5' />}
                        </div>

                        {/* Mobile Search Overlay */}
                        <AnimatePresence>
                            {searchBarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute top-24 left-0 w-full px-4 z-40 lg:hidden"
                                >
                                    <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-2xl border border-zinc-100 flex items-center gap-3">
                                        <Search className='text-green-500 w-5 h-5' />
                                        <input
                                            type="text"
                                            placeholder='Search organic products...'
                                            className='w-full outline-none text-zinc-700 font-medium'
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            autoFocus
                                        />
                                        <button type="button" onClick={() => setSearchBarOpen(false)}>
                                            <X className='text-zinc-400 w-5 h-5' />
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Link href={"/user/cart"} className='relative bg-zinc-100 rounded-xl w-11 h-11 flex items-center justify-center shadow-sm hover:bg-white hover:ring-2 hover:ring-green-500/20 transition group' aria-label={`View Shopping Cart, ${cartData.length} items`}>
                            <ShoppingCartIcon className='text-zinc-600 w-5 h-5 group-hover:text-green-600 transition-colors' aria-hidden="true" />
                            {cartData.length > 0 && (
                                <span className='absolute -top-2 -right-2 bg-green-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg border-2 border-white animate-in zoom-in'>
                                    {cartData.length}
                                </span>
                            )}
                        </Link>
                    </>
                )}

                {user.role == "admin" && (
                    <div className='hidden md:flex items-center gap-3'>
                        <Link href={"/admin/manage-orders"} className='flex items-center gap-2 bg-zinc-100 text-zinc-700 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm'>
                            <ClipboardCheck size={16} /> Orders
                        </Link>
                    </div>
                )}

                {/* Google Translate Widget */}
                <GoogleTranslator />

                {/* Text to Speech Tool */}
                <TextToSpeech />

                <div className='relative' ref={profileDropDown}>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        className='bg-linear-to-br from-green-500 to-emerald-700 p-[2px] rounded-2xl cursor-pointer shadow-lg shadow-green-500/10 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 outline-none'
                        onClick={() => setOpen(prev => !prev)}
                        onKeyDown={(e) => e.key === 'Enter' && setOpen(prev => !prev)}
                        role="button"
                        aria-expanded={open}
                        aria-haspopup="true"
                        aria-label={`User Profile Menu for ${user.name}`}
                        tabIndex={0}
                    >
                        <div className='bg-white rounded-[14px] w-10 h-10 relative overflow-hidden flex items-center justify-center'>
                            {user.image ? (
                                <Image src={user.image} alt='' fill className='object-cover' />
                            ) : (
                                <User className="text-green-600 w-5 h-5" aria-hidden="true" />
                            )}
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className='absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl shadow-green-900/10 border border-zinc-100 p-3 z-999 overflow-hidden'
                            >
                                <div className='flex items-center gap-4 px-4 py-4 mb-2 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl'>
                                    <div className='w-12 h-12 relative rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-green-100'>
                                        {user.image ? <Image src={user.image} alt='user' fill className='object-cover' /> : <User className="text-green-600" />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className='text-zinc-900 font-bold truncate'>{user.name}</div>
                                        <div className='text-[10px] text-green-600 font-black uppercase tracking-widest'>{user.role}</div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    {user.role === "farmer" && (
                                        <Link href={"/farmer-dashboard"} className='flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 rounded-xl text-zinc-600 font-semibold transition-colors' onClick={() => setOpen(false)}>
                                            <TrendingUp className='w-5 h-5 text-zinc-400' />
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role === "shg" && (
                                        <Link href={"/shg-dashboard"} className='flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 rounded-xl text-zinc-600 font-semibold transition-colors' onClick={() => setOpen(false)}>
                                            <TrendingUp className='w-5 h-5 text-zinc-400' />
                                            SHG Dashboard
                                        </Link>
                                    )}
                                    {user.role === "processor" && (
                                        <Link href={"/processor-dashboard"} className='flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 rounded-xl text-zinc-600 font-semibold transition-colors' onClick={() => setOpen(false)}>
                                            <TrendingUp className='w-5 h-5 text-zinc-400' />
                                            Processor Hub
                                        </Link>
                                    )}
                                    {user.role !== "user" && (
                                        <Link href={"/marketplace"} className='flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 rounded-xl text-zinc-600 font-semibold transition-colors' onClick={() => setOpen(false)}>
                                            <Package className='w-5 h-5 text-zinc-400' />
                                            {t('visitMarketplace')}
                                        </Link>
                                    )}
                                    {user.role == "user" && (
                                        <Link href={"/user/my-orders"} className='flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 rounded-xl text-zinc-600 font-semibold transition-colors' onClick={() => setOpen(false)}>
                                            <Package className='w-5 h-5 text-zinc-400' />
                                            {t('myOrders')}
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
                                            } else {
                                                alert("This user role does not have a guided tour yet.")
                                            }
                                        }}
                                        className='flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-zinc-50 rounded-xl text-zinc-600 font-semibold transition-colors'
                                    >
                                        <TrendingUp className='w-5 h-5 text-zinc-400' />
                                        Re-Take Tour
                                    </button>

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
                                        className='flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl text-red-600 font-semibold transition-colors'
                                    >
                                        <Trash2 className='w-5 h-5 text-red-400' />
                                        Delete My Account
                                    </button>


                                    <button className='flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl text-red-600 font-semibold transition-colors' onClick={() => {
                                        setOpen(false)
                                        signOut({ callbackUrl: "/login" })
                                    }}>
                                        <LogOut className='w-5 h-5 text-red-400' />
                                        {t('logout')}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {sideBar}
            {/* Real-time Call Listener */}
            {user?._id && <GlobalCallListener userId={user._id} role={user.role} />}
        </nav>
    )
}

export default Nav

'use client'
import { Boxes, ClipboardCheck, Cross, Leaf, LogOut, Menu, Package, Plus, PlusCircle, Search, ShoppingCartIcon, User, X } from 'lucide-react'

import Link from 'next/link'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'

interface IUser {
    _id?: string
    name: string
    email: string
    password?: string
    mobile?: string
    role: "user" | "deliveryBoy" | "admin" | "farmer" | "shg" | "buyer" | "startup" | "processor"
    image?: string
}
function Nav({ user }: { user: IUser }) {
    const [open, setOpen] = useState(false)
    const profileDropDown = useRef<HTMLDivElement>(null)
    const [searchBarOpen, setSearchBarOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { cartData } = useSelector((state: RootState) => state.cart)
    const [search, setSearch] = useState("")
    const router = useRouter()
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
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100 }}
                transition={{ type: "spring", stiffness: 100, damping: 14 }}
                className='fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-9999
              bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90
              backdrop-blur-xl border-r border-green-400/20
              shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)]
              flex flex-col p-6 text-white'
            >
                <div className='flex justify-between items-center mb-2'>
                    <h1 className='font-extrabold text-2xl tracking-wide text-white/90'>Admin Panel</h1>
                    <button className='text-white/80 hover:text-red-400 text-2xl font-bold transition'
                        onClick={() => setMenuOpen(false)}
                    ><X /></button>
                </div>
                <div className='flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner'>
                    <div className='relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-400/60 shadow-lg'> {user.image ? <Image src={user.image} alt='user' fill className='object-cover rounded-full' /> : <User />}</div>
                    <div >
                        <h2 className='text-lg font-semibold text-white'>{user.name}</h2>
                        <p className='text-xs text-green-200 capitalize tracking-wide'>{user.role}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-3 font-medium mt-6'>
                    <Link href={"/admin/add-product"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'><PlusCircle className='w-5 h-5' /> Add Product</Link>
                    <Link href={"/admin/view-products"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'><Boxes className='w-5 h-5' /> View Products</Link>
                    <Link href={"/admin/manage-orders"} className='flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all'><ClipboardCheck className='w-5 h-5' /> Manage Orders</Link>
                </div>
                <div className='my-5 border-t border-white/20'></div>
                <div className='flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all' onClick={async () => await signOut({ callbackUrl: "/" })}>
                    <LogOut className='w-5 h-5 text-red-300' />
                    Logout
                </div>
            </motion.div>
        </AnimatePresence>,
        document.body
    ) : null


    return (
        <nav className='w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-green-900/5 flex justify-between items-center h-20 px-6 md:px-10 z-50 border border-white/20 transition-all duration-300'>

            <Link href={"/"} className='flex items-center gap-2 group'>
                <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-12 transition-transform duration-300">
                    <Leaf className="text-white w-6 h-6" />
                </div>
                <span className='text-zinc-900 font-black text-xl sm:text-2xl tracking-tighter group-hover:text-green-600 transition-colors'>
                    MILLET<span className="text-green-600">.</span>
                </span>
            </Link>

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

            <div className='flex items-center gap-4 md:gap-6 relative'>
                {user.role == "user" && (
                    <>
                        <div className='bg-zinc-100 rounded-xl w-11 h-11 flex items-center justify-center shadow-sm hover:bg-white hover:ring-2 hover:ring-green-500/20 transition lg:hidden cursor-pointer' onClick={() => setSearchBarOpen((prev) => !prev)}>
                            <Search className='text-zinc-600 w-5 h-5' />
                        </div>

                        <Link href={"/user/cart"} className='relative bg-zinc-100 rounded-xl w-11 h-11 flex items-center justify-center shadow-sm hover:bg-white hover:ring-2 hover:ring-green-500/20 transition group'>
                            <ShoppingCartIcon className='text-zinc-600 w-5 h-5 group-hover:text-green-600 transition-colors' />
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

                <div className='relative' ref={profileDropDown}>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        className='bg-linear-to-br from-green-500 to-emerald-700 p-[2px] rounded-2xl cursor-pointer shadow-lg shadow-green-500/10'
                        onClick={() => setOpen(prev => !prev)}
                    >
                        <div className='bg-white rounded-[14px] w-10 h-10 relative overflow-hidden flex items-center justify-center'>
                            {user.image ? (
                                <Image src={user.image} alt='user' fill className='object-cover' />
                            ) : (
                                <User className="text-green-600 w-5 h-5" />
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
                                    {user.role !== "user" && (
                                        <Link href={"/marketplace"} className='flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 rounded-xl text-zinc-600 font-semibold transition-colors' onClick={() => setOpen(false)}>
                                            <Package className='w-5 h-5 text-zinc-400' />
                                            Visit Marketplace
                                        </Link>
                                    )}
                                    {user.role == "user" && (
                                        <Link href={"/user/my-orders"} className='flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 rounded-xl text-zinc-600 font-semibold transition-colors' onClick={() => setOpen(false)}>
                                            <Package className='w-5 h-5 text-zinc-400' />
                                            Order History
                                        </Link>
                                    )}

                                    <button className='flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl text-red-600 font-semibold transition-colors' onClick={() => {
                                        setOpen(false)
                                        signOut({ callbackUrl: "/login" })
                                    }}>
                                        <LogOut className='w-5 h-5 text-red-400' />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {sideBar}
        </nav>
    )
}

export default Nav

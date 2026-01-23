'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, Building, CreditCard, CreditCardIcon, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, Truck, User, ShieldCheck, Sparkles, Map as MapIcon, CreditCard as CardIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import toast from 'react-hot-toast'
import axios from 'axios'
import dynamic from 'next/dynamic'

const CheckOutMap = dynamic(() => import("@/components/CheckoutMap"), { ssr: false })

function Checkout() {
    const router = useRouter()
    const { userData } = useSelector((state: RootState) => state.user)
    const { subTotal, deliveryFee, finalTotal, cartData } = useSelector((state: RootState) => state.cart)
    const [address, setAddress] = useState({
        fullName: "",
        mobile: "",
        city: "",
        state: "",
        pincode: "",
        fullAddress: ""
    })
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [position, setPosition] = useState<[number, number] | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")
    const [orderLoading, setOrderLoading] = useState(false)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords
                setPosition([latitude, longitude])
            }, (err) => { console.log('location error', err) }, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 })
        }
    }, [])

    useEffect(() => {
        if (userData) {
            setAddress((prev) => ({ ...prev, fullName: userData?.name || "", mobile: userData?.mobile || "" }))
        }
    }, [userData])

    const handleSearchQuery = async () => {
        if (!searchQuery) return
        setSearchLoading(true)
        try {
            const { OpenStreetMapProvider } = await import("leaflet-geosearch")
            const provider = new OpenStreetMapProvider()
            const results = await provider.search({ query: searchQuery });
            if (results && results.length > 0) {
                setPosition([results[0].y, results[0].x])
                toast.success("Location found!")
            } else {
                toast.error("Location not found")
            }
        } catch (error) {
            toast.error("Search failed")
        } finally {
            setSearchLoading(false)
        }
    }

    useEffect(() => {
        const fetchAddress = async () => {
            if (!position) return
            try {
                const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
                setAddress(prev => ({
                    ...prev,
                    city: result.data.address.city || result.data.address.town || result.data.address.village,
                    state: result.data.address.state,
                    pincode: result.data.address.postcode,
                    fullAddress: result.data.display_name
                }))
            } catch (error) {
                console.error(error)
            }
        }
        fetchAddress()
    }, [position])

    const handleCod = async () => {
        if (!position) return toast.error('Set delivery location first')
        if (!address.fullName || !address.mobile || !address.fullAddress) return toast.error('Complete all fields')

        try {
            setOrderLoading(true)
            await axios.post("/api/user/order", {
                userId: userData?._id,
                items: cartData.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    quantity: item.quantity,
                    image: item.image
                })),
                totalAmount: finalTotal,
                address: { ...address, latitude: position[0], longitude: position[1] },
                paymentMethod
            })
            toast.success('Order placed successfully!')
            router.push("/user/order-success")
        } catch (error: any) {
            toast.error('Failed to place order')
        } finally {
            setOrderLoading(false)
        }
    }

    const handleOnlinePayment = async () => {
        if (!position) return toast.error('Set delivery location first')
        if (!address.fullName || !address.mobile || !address.fullAddress) return toast.error('Complete all fields')

        try {
            setOrderLoading(true)
            const result = await axios.post("/api/user/payment", {
                userId: userData?._id,
                items: cartData.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    quantity: item.quantity,
                    image: item.image
                })),
                totalAmount: finalTotal,
                address: { ...address, latitude: position[0], longitude: position[1] },
                paymentMethod
            })
            toast.success('Redirecting to Stripe...')
            window.location.href = result.data.url
        } catch (error: any) {
            toast.error('Payment initialization failed')
            setOrderLoading(false)
        }
    }

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude])
                toast.success("Location updated!")
            })
        }
    }

    return (
        <div className='min-h-screen bg-zinc-50 pb-24 pt-12'>
            <div className='w-[95%] sm:w-[90%] md:w-[85%] mx-auto relative'>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className='inline-flex items-center gap-2 text-zinc-500 hover:text-green-600 font-bold transition-all group mb-12'
                    onClick={() => router.push("/user/cart")}
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:border-green-600 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    <span className='text-sm uppercase tracking-widest'>Back to Cart</span>
                </motion.button>

                <div className="mb-12">
                    <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
                        <ShieldCheck size={14} />
                        <span>Highly Secure Checkout</span>
                    </div>
                    <h1 className='text-4xl md:text-5xl font-black text-zinc-900 tracking-tight'>Confirm Order</h1>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-5 gap-12'>
                    <div className="lg:col-span-3 space-y-8">
                        {/* Address Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-white rounded-[3rem] shadow-2xl shadow-zinc-900/5 p-8 md:p-10 border border-zinc-100'
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                    <MapIcon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Delivery Details</h2>
                                    <p className="text-zinc-500 text-sm font-medium">Where should we deliver your millets?</p>
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className='relative group'>
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={18} />
                                        <input type="text" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress((prev) => ({ ...prev, fullName: e.target.value }))} className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/10 focus:border-green-500 focus:outline-none transition-all font-medium text-sm' />
                                    </div>
                                    <div className='relative group'>
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={18} />
                                        <input type="text" placeholder="Mobile Number" value={address.mobile} onChange={(e) => setAddress((prev) => ({ ...prev, mobile: e.target.value }))} className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/10 focus:border-green-500 focus:outline-none transition-all font-medium text-sm' />
                                    </div>
                                </div>
                                <div className='relative group'>
                                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={18} />
                                    <input type="text" placeholder="Full Detailed Address" value={address.fullAddress} onChange={(e) => setAddress((prev) => ({ ...prev, fullAddress: e.target.value }))} className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/10 focus:border-green-500 focus:outline-none transition-all font-medium text-sm' />
                                </div>
                                <div className='grid grid-cols-3 gap-4'>
                                    <input type="text" value={address.city} placeholder='City' onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))} className='bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-zinc-800 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-medium text-sm' />
                                    <input type="text" value={address.state} placeholder='State' onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))} className='bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-zinc-800 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-medium text-sm' />
                                    <input type="text" value={address.pincode} placeholder='Pincode' onChange={(e) => setAddress((prev) => ({ ...prev, pincode: e.target.value }))} className='bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-zinc-800 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-medium text-sm' />
                                </div>

                                <div className='flex gap-2 mt-8'>
                                    <div className="relative flex-1 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={18} />
                                        <input type="text" placeholder='Search your location...' className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 focus:bg-white focus:border-green-500 focus:outline-none transition-all font-medium text-sm' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    </div>
                                    <motion.button whileTap={{ scale: 0.95 }} className='bg-zinc-900 text-white px-8 rounded-2xl font-bold shadow-xl shadow-zinc-900/10 hover:bg-green-600 transition-all flex items-center justify-center' onClick={handleSearchQuery}>
                                        {searchLoading ? <Loader2 size={18} className='animate-spin' /> : "Locate"}
                                    </motion.button>
                                </div>

                                <div className='relative mt-6 h-[400px] rounded-[2.5rem] overflow-hidden border border-zinc-200 shadow-inner group'>
                                    {position && <CheckOutMap position={position} setPosition={setPosition} />}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className='absolute bottom-6 right-6 bg-green-600 text-white shadow-2xl rounded-2xl p-4 hover:bg-green-700 transition-all flex items-center justify-center z-10'
                                        onClick={handleCurrentLocation}
                                    >
                                        <LocateFixed size={24} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        {/* Payment Selection */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='bg-white rounded-[3rem] shadow-2xl shadow-zinc-900/5 p-8 border border-zinc-100'
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <CardIcon size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Payment Hub</h2>
                                    <p className="text-zinc-500 text-sm font-medium">Choose your preferred settlement method.</p>
                                </div>
                            </div>

                            <div className='space-y-4 mb-10'>
                                <button
                                    onClick={() => setPaymentMethod("online")}
                                    className={`flex items-center justify-between w-full border-2 rounded-[1.5rem] p-6 transition-all ${paymentMethod === "online"
                                        ? "border-green-600 bg-green-50 shadow-lg shadow-green-900/5"
                                        : "border-zinc-50 hover:bg-zinc-50"
                                        }`}>
                                    <div className="flex items-center gap-4">
                                        <CreditCardIcon className={paymentMethod === "online" ? "text-green-600" : "text-zinc-400"} />
                                        <div className="text-left">
                                            <div className="font-black text-zinc-900 text-sm">Online Payment</div>
                                            <div className="text-[10px] uppercase font-bold text-zinc-400">Secure via Stripe</div>
                                        </div>
                                    </div>
                                    {paymentMethod === 'online' && <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-sm" />}
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("cod")}
                                    className={`flex items-center justify-between w-full border-2 rounded-[1.5rem] p-6 transition-all ${paymentMethod === "cod"
                                        ? "border-green-600 bg-green-50 shadow-lg shadow-green-900/5"
                                        : "border-zinc-50 hover:bg-zinc-50"
                                        }`}>
                                    <div className="flex items-center gap-4">
                                        <Truck className={paymentMethod === "cod" ? "text-green-600" : "text-zinc-400"} />
                                        <div className="text-left">
                                            <div className="font-black text-zinc-900 text-sm">Cash on Delivery</div>
                                            <div className="text-[10px] uppercase font-bold text-zinc-400">Pay at your doorstep</div>
                                        </div>
                                    </div>
                                    {paymentMethod === 'cod' && <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-sm" />}
                                </button>
                            </div>

                            <div className='bg-zinc-50 p-8 rounded-[2rem] space-y-4 border border-zinc-100'>
                                <div className='flex justify-between items-center text-zinc-500'>
                                    <span className='font-bold text-xs uppercase tracking-widest'>Subtotal</span>
                                    <span className='font-black text-zinc-900'>₹{subTotal}</span>
                                </div>
                                <div className='flex justify-between items-center text-zinc-500'>
                                    <span className='font-bold text-xs uppercase tracking-widest'>Logistic Fee</span>
                                    <span className='font-black text-zinc-900'>₹{deliveryFee}</span>
                                </div>
                                <div className='flex justify-between items-center border-t border-zinc-200 pt-6'>
                                    <span className='font-black text-zinc-900 text-lg'>Order Total</span>
                                    <span className='text-3xl font-black text-green-600 tracking-tighter'>₹{finalTotal}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={orderLoading}
                                className='w-full mt-10 bg-green-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-green-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3 hover:bg-green-700'
                                onClick={() => paymentMethod === "cod" ? handleCod() : handleOnlinePayment()}
                            >
                                {orderLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        <span>{paymentMethod === "cod" ? "Place Order" : "Initiate Payment"}</span>
                                        <Sparkles size={18} />
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout


'use client'
import { ArrowLeft, Loader, Plus, PlusCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const categories = [
    "Raw Millets",
    "Millet Rice",
    "Millet Flour",
    "Millet Snacks",
    "Value-Added Products",
    "Seeds",
    "Other"
]

const units = [
    "kg", "g", "liter", "ml", "piece", "pack", "quintal"
]
function AddProduct() {
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

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [unit, setUnit] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState<string>("100")
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<string | null>()
    const [backendImage, setBackendImage] = useState<File | null>()

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length == 0) return
        const file = files[0]
        setBackendImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!name || !category || !unit || !price) {
            return toast.error("Please fill all required fields")
        }
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("price", price)
            formData.append("unit", unit)
            formData.append("stock", stock)
            if (backendImage) {
                formData.append("image", backendImage)
            }

            const result = await axios.post("/api/admin/add-product", formData)
            console.log(result.data)
            toast.success("Product added successfully!")

            // Reset form
            setName("")
            setCategory("")
            setUnit("")
            setPrice("")
            setStock("100")
            setPreview(null)
            setBackendImage(null)

            // Redirect after delay
            setTimeout(() => {
                router.push("/admin/view-products")
            }, 1500)

            setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error("Failed to add product")
            setLoading(false)
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-10 px-4 relative'>
            <Link href={"/admin/view-products"} className='absolute top-6 left-6 flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-md hover:bg-green-100 dark:hover:bg-zinc-800 hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-800 z-50'>
                <ArrowLeft className='w-5 h-5' />
                <span className='hidden md:flex text-xs uppercase tracking-widest'>Back to Dashboard</span>
            </Link>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className='bg-white dark:bg-zinc-900 w-full max-w-xl shadow-2xl rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6 md:p-10'
            >
                <div className='flex flex-col items-center mb-6'>
                    <div className='flex items-center gap-3'>
                        <PlusCircle className='text-green-600 w-8 h-8' />
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Add New Product</h1>
                    </div>
                    <p className='text-zinc-500 dark:text-zinc-400 text-xs font-semibold mt-2 text-center uppercase tracking-widest'>Inventory Registration</p>
                </div>
                <form className='flex flex-col gap-4 w-full ' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className='block text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-black tracking-widest mb-1.5 ml-1'> Product Name <span className='text-red-500'>*</span></label>
                        <input type="text" id='name' placeholder='eg: Foxtail Millet, Ragi Biscuits ...'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className='w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-400 transition-all font-medium placeholder:text-zinc-300 dark:placeholder:text-zinc-600' />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div >
                            <label className='block text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-black tracking-widest mb-1.5 ml-1'>Category <span className='text-red-500'>*</span></label>
                            <select name="category" value={category} className='w-full border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-bold appearance-none' onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='block text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-black tracking-widest mb-1.5 ml-1'>Unit <span className='text-red-500'>*</span></label>
                            <select name="unit" className='w-full border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-bold appearance-none'
                                onChange={(e) => setUnit(e.target.value)}
                                value={unit}
                            >
                                <option value="">Select Unit</option>
                                {units.map(cat => (
                                    <option value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div>
                            <label htmlFor="name-price" className='block text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-black tracking-widest mb-1.5 ml-1'> Price <span className='text-red-500'>*</span></label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                                <input type="text" id='name-price' placeholder='eg. 120' className='w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl pl-10 pr-5 py-4 outline-none focus:ring-2 focus:ring-green-400 transition-all font-bold'
                                    onChange={(e) => setPrice(e.target.value)}
                                    value={price}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="stock" className='block text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-black tracking-widest mb-1.5 ml-1'> Stock Inventory</label>
                            <input type="number" id='stock' placeholder='eg. 100' className='w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-green-400 transition-all font-bold'
                                onChange={(e) => setStock(e.target.value)}
                                value={stock}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row items-center gap-5 mt-2'>
                        <label htmlFor="image" className='cursor-pointer flex items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-black uppercase tracking-widest text-[10px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl px-8 py-5 hover:border-green-400 transition-all w-full sm:flex-1'>
                            <Upload className='w-5 h-5 text-green-600' />   Select Asset </label>

                        <input type="file" id='image' accept='image/*' hidden
                            onChange={handleImageChange}

                        />
                        {preview && <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-green-500 shadow-xl relative shrink-0">
                            <Image src={preview} fill alt='image' className='object-cover' />
                        </div>}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className='mt-6 w-full bg-zinc-900 dark:bg-green-600 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-2xl shadow-zinc-900/20 disabled:opacity-60 transition-all flex items-center justify-center gap-3 text-xs'
                    >
                        {loading ? <Loader className='w-5 h-5 animate-spin' /> : (
                            <>
                                <Plus size={16} />
                                Initialize Listing
                            </>
                        )}

                    </motion.button>
                </form>

            </motion.div>
        </div>
    )
}


export default AddProduct

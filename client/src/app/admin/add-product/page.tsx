'use client'
import { ArrowLeft, Loader, Plus, PlusCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

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
        <div className='min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 py-16 px-4 relative'>
            <Link href={"/"} className='absolute top-6 left-6 flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-md hover:bg-green-100 dark:hover:bg-zinc-800 hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-800'>
                <ArrowLeft className='w-5 h-5' />
                <span className='hidden md:flex'>Back to home</span>
            </Link>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className='bg-white dark:bg-zinc-900 w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 dark:border-zinc-800 p-8'
            >
                <div className='flex flex-col items-center mb-8'>
                    <div className='flex items-center gap-3'>
                        <PlusCircle className='text-green-600 w-8 h-8' />
                        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">Add New Product</h1>
                    </div>
                    <p className='text-gray-500 dark:text-gray-400 text-sm mt-2 text-center'>Fill out the details below to add a new millet product.
                    </p>
                </div>
                <form className='flex flex-col gap-6 w-full ' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className='block text-gray-700 dark:text-zinc-400 font-medium mb-1'> Product Name <span className='text-red-500'>*</span></label>
                        <input type="text" id='name' placeholder='eg: Foxtail Millet, Ragi Biscuits ...'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className='w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all' />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div >
                            <label className='block text-gray-700 dark:text-zinc-400 font-medium mb-1'>Category<span className='text-red-500'>*</span></label>
                            <select name="category" value={category} className='w-full border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100' onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='block text-gray-700 dark:text-zinc-400 font-medium mb-1'>Unit<span className='text-red-500'>*</span></label>
                            <select name="unit" className='w-full border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100'
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
                    <div>
                        <label htmlFor="name-price" className='block text-gray-700 dark:text-zinc-400 font-medium mb-1'> Price <span className='text-red-500'>*</span></label>
                        <input type="text" id='name-price' placeholder='eg. 120' className='w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all'
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </div>
                    <div>
                        <label htmlFor="stock" className='block text-gray-700 dark:text-zinc-400 font-medium mb-1'> Stock Inventory (kg/units) <span className='text-zinc-400 text-xs'>(0 for Out of Stock)</span></label>
                        <input type="number" id='stock' placeholder='eg. 100' className='w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all'
                            onChange={(e) => setStock(e.target.value)}
                            value={stock}
                        />
                    </div>
                    <div className='flex flex-col sm:flex-row items-center gap-5'>
                        <label htmlFor="image" className='cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all w-full sm:w-auto'>
                            <Upload className='w-5 h-5' />   Upload image </label>

                        <input type="file" id='image' accept='image/*' hidden
                            onChange={handleImageChange}

                        />
                        {preview && <Image src={preview} width={100} height={100} alt='image' className='rounded-xl shadow-md border border-gray-200 object-cover' />}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={loading}
                        className='mt-4 w-full bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2'
                    >
                        {loading ? <Loader className='w-5 h-5 animate-spin' /> : "Add Product"}

                    </motion.button>
                </form>

            </motion.div>
        </div>
    )
}

export default AddProduct

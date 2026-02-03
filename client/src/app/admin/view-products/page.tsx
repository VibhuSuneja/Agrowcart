'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Loader, Package, Pencil, Search, Upload, X, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/models/product.model'
import Image from 'next/image'
import toast from 'react-hot-toast'
const categories = [
    "Raw Millets",
    "Millet Rice",
    "Millet Flour",
    "Millet Snacks",
    "Value-Added",
    "Seeds",
    "Organic Mix"
]
const units = [
    "kg", "g", "liter", "ml", "piece", "pack", "quintal"
]
function ViewProducts() {
    const router = useRouter()
    const [products, setProducts] = useState<IProduct[]>()
    const [search, setSearch] = useState("")
    const [editing, setEditing] = useState<IProduct | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [backendImage, setBackendImage] = useState<Blob | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [fillterd, setFilltered] = useState<IProduct[]>()
    useEffect(() => {
        const getProducts = async () => {
            try {
                const result = await axios.get(`/api/admin/get-products?t=${Date.now()}`)
                setProducts(result.data)
                setFilltered(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getProducts()
    }, [])

    useEffect(() => {
        if (editing) {
            setImagePreview(editing.image)
        }
    }, [editing])


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBackendImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleEdit = async () => {
        setLoading(true)
        if (!editing) return
        try {
            const formData = new FormData()
            formData.append("productId", editing?._id?.toString()!)
            formData.append("name", editing?.name)
            formData.append("category", editing.category)
            formData.append("price", editing.price)
            formData.append("unit", editing.unit)
            formData.append("scientificBenefits", editing.scientificBenefits || "")
            formData.append("fssaiLicense", editing.fssaiLicense || "")
            formData.append("isCompliant", editing.isCompliant ? "true" : "false")
            formData.append("originState", editing.originState || "Haryana")
            formData.append("originCity", editing.originCity || "")
            formData.append("stock", editing.stock?.toString() || "0")
            const result = await axios.post("/api/admin/edit-product", formData)
            setLoading(false)
            toast.success(`Product batch updated!`)
            setTimeout(() => window.location.reload(), 800)
        } catch (error) {
            console.log(error)
        }
    }
    const handleDelete = async () => {
        setDeleteLoading(true)
        if (!editing) return
        try {
            const result = await axios.post("/api/admin/delete-product", { productId: editing._id })
            setDeleteLoading(false)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const q = search.toLowerCase()

        setFilltered(
            products?.filter(
                (g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)


            )
        )

    }
    return (
        <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
            >
                <button
                    onClick={() => router.push("/")}
                    className='flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto'
                ><ArrowLeft size={18} /><span>Back</span></button>
                <h1 className='text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2'><Package size={28} className='text-green-600' />Manage Products</h1>
            </motion.div>

            <motion.form initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSearch}
                className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full">
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                <input type="text" className='w-full outline-none text-gray-700 placeholder-gray-400' placeholder='Search by name or category...' value={search} onChange={(e) => setSearch(e.target.value)} />
            </motion.form>
            <div className='space-y-4'>
                {fillterd?.map((g, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all"
                    >
                        <div className='relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200'>
                            <Image
                                src={g.image}
                                alt={g.name}
                                fill
                                className='object-cover hover:scale-110 transition-transform duration-500'
                            />
                        </div>

                        <div className='flex-1 flex flex-col justify-between w-full'>
                            <div>
                                <h3 className='font-semibold text-gray-800 text-lg truncate flex items-center gap-2'>
                                    {g.name}
                                    {g.isCompliant && <span className="text-[10px] bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified</span>}
                                </h3>
                                <div className="flex flex-col gap-1">
                                    <p className='text-zinc-500 text-xs font-bold capitalize'>{g.category}</p>
                                    <p className='text-zinc-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5'>
                                        <MapPin size={12} className="text-zinc-300" />
                                        {g.originCity ? `${g.originCity}, ` : ''}{g.originState || 'Haryana'}
                                    </p>
                                </div>
                            </div>

                            <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                <p className='text-green-700 font-bold text-lg'>
                                    ₹{g.price}/ <span className='text-gray-500 text-sm font-medium ml-1'>{g.unit}</span>
                                </p>
                                <button className='bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all' onClick={() => setEditing(g)}>
                                    <Pencil size={15} /> Edit
                                </button>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4"
                    >

                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative"
                        >
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-2xl font-bold text-green-700'>Edit Product</h2>
                                <button className='text-gray-600 hover:text-red-600' onClick={() => setEditing(null)}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div className='relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group'>
                                {imagePreview && <Image
                                    src={imagePreview}
                                    alt={editing.name}
                                    fill
                                    className='object-cover'
                                />}
                                <label htmlFor='imageUpload' className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity'><Upload size={28} className='text-green-500' /></label>
                                <input type="file" accept='image/*' hidden id='imageUpload' onChange={handleImageUpload} />
                            </div>

                            <div className='space-y-4'>
                                <input
                                    type="text"
                                    placeholder='Enter Product Name'
                                    value={editing.name}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                    className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none' />

                                <select
                                    className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white'
                                    value={editing.category}
                                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                                >
                                    <option>Select Category</option>
                                    {categories.map((c, i) => (
                                        <option key={i} value={c}>{c}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder='Price'
                                    value={editing.price}
                                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                                    className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                                    min="0"
                                    step="1"
                                />
                                <select
                                    className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white'
                                    value={editing.unit}
                                    onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
                                >
                                    <option>Select Category</option>
                                    {units.map((u, i) => (
                                        <option key={i} value={u}>{u}</option>
                                    ))}
                                </select>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Stock Level (0 = Out of Stock)</label>
                                    <input
                                        type="number"
                                        placeholder='Stock Inventory'
                                        value={editing.stock || 0}
                                        onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                                        className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none'
                                    />
                                </div>
                                <textarea
                                    placeholder='Scientific Knowledge (3-4 lines)'
                                    value={editing.scientificBenefits}
                                    onChange={(e) => setEditing({ ...editing, scientificBenefits: e.target.value })}
                                    className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none resize-none'
                                    rows={4}
                                />
                                <div className="p-4 bg-zinc-50 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-zinc-600">Verification Status</span>
                                        <button
                                            onClick={() => setEditing({ ...editing, isCompliant: !editing.isCompliant })}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${editing.isCompliant ? 'bg-green-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}
                                        >
                                            {editing.isCompliant ? 'Verified' : 'Pending'}
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">FSSAI License</label>
                                        <input
                                            value={editing.fssaiLicense || ''}
                                            onChange={(e) => setEditing({ ...editing, fssaiLicense: e.target.value })}
                                            className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-sm font-bold"
                                            placeholder="No license provided"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Origin State</label>
                                        <input
                                            value={editing.originState || 'Haryana'}
                                            onChange={(e) => setEditing({ ...editing, originState: e.target.value })}
                                            className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Origin City</label>
                                        <input
                                            value={editing.originCity || ''}
                                            onChange={(e) => setEditing({ ...editing, originCity: e.target.value })}
                                            className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-sm font-bold"
                                            placeholder="Enter City"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end gap-3 mt-6'>
                                <button className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all"
                                    onClick={handleEdit}
                                    disabled={loading}
                                >
                                    {loading ? <Loader size={14} /> : "Edit Product"}
                                </button>
                                <button className="px-4 py-2 rounded-lg  bg-red-600 text-white flex items-center gap-2 hover:bg-red-700  transition"
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? <Loader size={14} /> : "Delete Product"}
                                </button>
                            </div>
                        </motion.div>


                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    )
}

export default ViewProducts

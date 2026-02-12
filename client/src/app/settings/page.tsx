'use client'

import React, { useEffect, useState, useRef } from 'react'
import Nav from '@/components/Nav'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import PasskeyManager from '@/components/PasskeyManager'
import axios from 'axios'
import { Loader2, ShieldCheck, User, Camera, Edit3, Save, Circle, CheckCircle2, X, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

function SettingsPage() {
    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const { update: updateSession } = useSession()
    const [passkeys, setPasskeys] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        status: 'online' as 'online' | 'away' | 'dnd'
    })
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchPasskeys = async () => {
        try {
            const res = await axios.get('/api/auth/passkey/list')
            if (res.data.success) {
                setPasskeys(res.data.passkeys)
            }
        } catch (error) {
            console.error("Failed to fetch passkeys", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userData) {
            fetchPasskeys()
            setFormData({
                name: userData.name || '',
                bio: userData.bio || '',
                status: userData.status || 'online'
            })
            setImagePreview(userData.image || null)
        }
    }, [userData])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const submitData = new FormData()
            submitData.append('name', formData.name)
            submitData.append('bio', formData.bio)
            submitData.append('status', formData.status)
            if (selectedImage) {
                submitData.append('image', selectedImage)
            }

            const res = await axios.post('/api/user/update-profile', submitData)

            if (res.status === 200) {
                const updatedUser = res.data.user

                // Update local redux state
                dispatch(setUserData({
                    ...userData,
                    ...updatedUser
                }))

                // Update next-auth session
                await updateSession({
                    name: updatedUser.name,
                    image: updatedUser.image,
                    bio: updatedUser.bio,
                    status: updatedUser.status
                })

                toast.success('Profile updated successfully!')
                setIsEditing(false)
                setSelectedImage(null)
            }
        } catch (error: any) {
            console.error('Update profile error:', error)
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        )
    }

    const navUser: any = userData

    const statusColors = {
        online: 'bg-emerald-500',
        away: 'bg-amber-500',
        dnd: 'bg-red-500'
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-20">
            <Nav user={navUser} />

            <div className="pt-32 px-6 max-w-4xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">Account Settings</h1>
                        <p className="text-zinc-500 text-lg">Manage your identity and presence on AgrowCart.</p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xl shadow-zinc-900/10"
                        >
                            <Edit3 size={16} />
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="grid gap-8">
                    {/* Profile Summary / Edit Card */}
                    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-zinc-900/5 border border-zinc-100 dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>

                        <div className="flex flex-col md:flex-row gap-10 relative">
                            {/* Profile Image Column */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <div className="w-40 h-40 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl relative">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt={formData.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                <User size={64} />
                                            </div>
                                        )}

                                        {isEditing && (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                            >
                                                <Camera size={32} className="mb-2" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                                            </button>
                                        )}
                                    </div>
                                    {/* Presence Indicator */}
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${statusColors[formData.status]} rounded-2xl border-4 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center`}>
                                        <div className="w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {isEditing && (
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">MAX. 5MB</p>
                                )}
                            </div>

                            {/* Info Column */}
                            <div className="flex-1 space-y-8">
                                {!isEditing ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{userData.name}</h2>
                                            <p className="text-zinc-500 font-medium text-lg mb-4">{userData.email}</p>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                                                    <ShieldCheck size={12} />
                                                    {userData.role} Account
                                                </span>
                                                {userData.isVerified && (
                                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                                        <CheckCircle2 size={12} />
                                                        Verified Official
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${formData.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : formData.status === 'away' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'} text-[10px] font-black uppercase tracking-widest border`}>
                                                    <Circle size={8} fill="currentColor" />
                                                    {formData.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-zinc-100 dark:border-white/5">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Professional Bio</p>
                                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium italic">
                                                {userData.bio || "No bio added yet. Tell us about your journey in AgrowCart."}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {/* Name Input */}
                                        <div className="space-y-2">
                                            <label htmlFor="displayName" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Display Name</label>
                                            <input
                                                id="displayName"
                                                type="text"
                                                className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl py-4 px-5 text-zinc-800 dark:text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        {/* Status Picker */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Presence Status</label>
                                            <div className="flex gap-4">
                                                {['online', 'away', 'dnd'].map((st) => (
                                                    <button
                                                        key={st}
                                                        onClick={() => setFormData({ ...formData, status: st as any })}
                                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest ${formData.status === st ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg' : 'bg-white dark:bg-white/5 text-zinc-400 border-zinc-100 dark:border-white/10 hover:border-zinc-300'}`}
                                                    >
                                                        <Circle size={8} fill={formData.status === st ? 'white' : 'currentColor'} className={st === 'online' ? 'text-emerald-500' : st === 'away' ? 'text-amber-500' : 'text-red-500'} />
                                                        {st}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bio Input */}
                                        <div className="space-y-2">
                                            <label htmlFor="bio" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Personal Bio</label>
                                            <textarea
                                                id="bio"
                                                className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl py-4 px-5 text-zinc-800 dark:text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all min-h-[120px] resize-none"
                                                placeholder="Share your agricultural vision..."
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                disabled={saving}
                                                onClick={handleSave}
                                                className="flex-1 flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 className="animate-spin" size={18} /> : (
                                                    <>
                                                        <Save size={18} />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                disabled={saving}
                                                onClick={() => {
                                                    setIsEditing(false)
                                                    setImagePreview(userData.image || null)
                                                    setFormData({
                                                        name: userData.name || '',
                                                        bio: userData.bio || '',
                                                        status: userData.status || 'online'
                                                    })
                                                }}
                                                className="px-6 py-4 bg-zinc-100 dark:bg-white/5 text-zinc-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security Section (Passkeys) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-zinc-900/5 border border-zinc-100 dark:border-white/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -ml-20 -mt-20"></div>
                        <PasskeyManager
                            userPasskeys={passkeys}
                            onUpdate={fetchPasskeys}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage

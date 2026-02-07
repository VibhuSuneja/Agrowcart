'use client'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useRouter, useParams } from 'next/navigation'
import { Lock, EyeIcon, EyeOff, Loader2, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const { token } = useParams()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters!")
            return
        }

        setLoading(true)
        try {
            const res = await axios.post('/api/auth/reset-password', {
                token,
                password
            })
            setSuccess(true)
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Reset failed. The link may be invalid or expired.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-zinc-100 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">Password reset!</h1>
                    <p className="text-zinc-500 font-medium mb-10">Your account is now secure again. You can now login with your new password.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-3"
                    >
                        <span>Continue to Login</span>
                        <ArrowRight size={20} />
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 relative overflow-hidden">
            <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100 rounded-full blur-[100px] opacity-50' />
            <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[100px] opacity-50' />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-zinc-100 relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-zinc-900/20">
                        <Lock className="text-emerald-400" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Secure Reset</h1>
                    <p className="text-zinc-500 text-sm font-medium">Choose a strong password for your AgrowCart account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            required
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-5 pl-14 pr-12 text-zinc-900 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            required
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-5 pl-14 pr-12 text-zinc-900 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-200 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 mt-4 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                <span>Update Password</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-10 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    Millets Value Chain Platform
                </p>
            </motion.div>
        </div>
    )
}

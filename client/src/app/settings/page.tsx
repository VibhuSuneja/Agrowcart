'use client'

import React, { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import PasskeyManager from '@/components/PasskeyManager'
import axios from 'axios'
import { Loader2, ShieldCheck, User } from 'lucide-react'
import { motion } from 'motion/react'

function SettingsPage() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [passkeys, setPasskeys] = useState([])
    const [loading, setLoading] = useState(true)

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
        }
    }, [userData])

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        )
    }

    // Cast userData as any to satisfy Nav prop type if mismatch exists
    const navUser: any = userData

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-20">
            <Nav user={navUser} />

            <div className="pt-32 px-6 max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">Account Settings</h1>
                    <p className="text-zinc-500 text-lg">Manage your security and account preferences.</p>
                </div>

                <div className="grid gap-8">
                    {/* Profile Summary Card */}
                    <div className="bg-white dark:bg-white/5 rounded-[2rem] p-8 shadow-xl shadow-zinc-900/5 hover:shadow-emerald-900/5 transition-all border border-zinc-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors"></div>

                        <div className="flex items-start gap-6 relative">
                            <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400">
                                {userData.image ? (
                                    <img src={userData.image} alt={userData.name} className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <User size={32} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{userData.name}</h2>
                                <p className="text-zinc-500 font-medium mb-2">{userData.email}</p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest">
                                    <ShieldCheck size={12} />
                                    {userData.role} Account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Security Section (Passkeys) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-zinc-900/5 border border-zinc-100 dark:border-white/5"
                    >
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

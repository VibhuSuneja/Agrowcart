'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Fingerprint, Loader2, CheckCircle, Shield, Trash2, AlertCircle, Plus } from 'lucide-react'
import { startRegistration } from '@simplewebauthn/browser'
import axios from 'axios'
import toast from 'react-hot-toast'

interface PasskeyCredential {
    credentialID: string
    createdAt: string
    transports?: string[]
}

interface PasskeyManagerProps {
    userPasskeys?: PasskeyCredential[]
    onUpdate?: () => void
}

export default function PasskeyManager({ userPasskeys = [], onUpdate }: PasskeyManagerProps) {
    const [passkeys, setPasskeys] = useState<PasskeyCredential[]>(userPasskeys)
    const [isRegistering, setIsRegistering] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    useEffect(() => {
        setPasskeys(userPasskeys)
    }, [userPasskeys])

    const handleRegisterPasskey = async () => {
        setIsRegistering(true)
        try {
            // Step 1: Get registration options from server
            const optionsRes = await axios.post('/api/auth/passkey/register-options')
            const options = optionsRes.data

            if (options.error) {
                toast.error(options.error)
                setIsRegistering(false)
                return
            }

            // Step 2: Trigger the browser's biometric registration prompt
            const registrationResponse = await startRegistration({ optionsJSON: options })

            // Step 3: Send the response to the server for verification
            const verifyRes = await axios.post('/api/auth/passkey/register-verify', registrationResponse)

            if (verifyRes.data.success) {
                toast.success("Passkey registered successfully! You can now use biometric login.")
                onUpdate?.()
                // Refresh the list
                const newPasskey: PasskeyCredential = {
                    credentialID: registrationResponse.id,
                    createdAt: new Date().toISOString(),
                    transports: registrationResponse.response.transports || []
                }
                setPasskeys([...passkeys, newPasskey])
            } else {
                toast.error(verifyRes.data.error || "Failed to register passkey")
            }
        } catch (error: any) {
            console.error("Passkey registration error:", error)
            if (error.name === 'NotAllowedError') {
                toast.error("Biometric registration was cancelled or denied.")
            } else if (error.name === 'InvalidStateError') {
                toast.error("This device is already registered as a passkey.")
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error)
            } else {
                toast.error("Failed to register passkey. Please try again.")
            }
        } finally {
            setIsRegistering(false)
        }
    }

    const handleDeletePasskey = async (credentialID: string) => {
        if (!confirm("Are you sure you want to remove this passkey? You will need to use password login instead.")) {
            return
        }

        setIsDeleting(credentialID)
        try {
            const res = await axios.delete('/api/auth/passkey/delete', {
                data: { credentialID }
            })

            if (res.data.success) {
                toast.success("Passkey removed successfully")
                setPasskeys(passkeys.filter(p => p.credentialID !== credentialID))
                onUpdate?.()
            } else {
                toast.error(res.data.error || "Failed to remove passkey")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to remove passkey")
        } finally {
            setIsDeleting(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                        <Shield className="text-emerald-600 dark:text-emerald-400" size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-zinc-900 dark:text-white">Passkey Authentication</h3>
                        <p className="text-sm text-zinc-500">Use fingerprint or Face ID to sign in securely</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRegisterPasskey}
                    disabled={isRegistering}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 transition-all"
                >
                    {isRegistering ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plus size={18} />
                    )}
                    <span>{isRegistering ? 'Registering...' : 'Add Passkey'}</span>
                </motion.button>
            </div>

            {/* Passkey List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {passkeys.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-50 dark:bg-white/5 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Fingerprint className="text-zinc-400" size={32} />
                            </div>
                            <h4 className="font-bold text-zinc-700 dark:text-zinc-300 mb-2">No passkeys registered</h4>
                            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                                Add a passkey to enable passwordless login using your device's biometric authentication.
                            </p>
                        </motion.div>
                    ) : (
                        passkeys.map((passkey, index) => (
                            <motion.div
                                key={passkey.credentialID}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                        <Fingerprint className="text-emerald-600 dark:text-emerald-400" size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-zinc-900 dark:text-white">Device Passkey</h4>
                                            <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle size={10} />
                                                <span>Active</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-500 mt-0.5">
                                            Registered on {formatDate(passkey.createdAt)}
                                        </p>
                                        {passkey.transports && passkey.transports.length > 0 && (
                                            <p className="text-xs text-zinc-400 mt-1">
                                                Transports: {passkey.transports.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeletePasskey(passkey.credentialID)}
                                    disabled={isDeleting === passkey.credentialID}
                                    className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                    {isDeleting === passkey.credentialID ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 size={20} />
                                    )}
                                </motion.button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">How it works</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        Passkeys use your device's fingerprint sensor, Face ID, or security key to securely authenticate you without a password. Your biometric data never leaves your device.
                    </p>
                </div>
            </div>
        </div>
    )
}

'use client'
import React from 'react'
import { motion } from "motion/react"
import { XCircle, ArrowRight, RefreshCw, ShoppingCart, Home, Phone, HelpCircle } from 'lucide-react'
import Link from 'next/link'

function OrderCancel() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-b from-red-50 to-white'>
            {/* Main Cancellation Icon */}
            <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    damping: 10,
                    stiffness: 100
                }}
                className='relative'
            >
                <XCircle className='text-red-500 w-24 h-24 md:w-28 md:h-28' />
                <motion.div
                    className='absolute inset-0'
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0.3, 0, 0.3], scale: [1, 0.6, 1] }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                    }}
                >
                    <div className='w-full h-full rounded-full bg-red-500 blur-2xl' />
                </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className='text-3xl md:text-4xl font-bold text-red-600 mt-6'
            >
                Payment Cancelled
            </motion.h1>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className='text-gray-600 mt-3 text-sm md:text-base max-w-md'
            >
                Your payment was not completed. Don't worry – your cart items are still saved and no charges were made to your account.
            </motion.p>

            {/* Helpful Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-zinc-100 max-w-md w-full"
            >
                <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="text-amber-500" size={20} />
                    <h3 className="text-lg font-bold text-zinc-900">What happened?</h3>
                </div>
                <ul className="text-left text-sm text-zinc-600 space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        You closed the payment window before completion
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        The payment was declined by your bank
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        There was a network interruption
                    </li>
                </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
            >
                <Link href={"/user/checkout"}>
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.93 }}
                        className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all'
                    >
                        <RefreshCw size={18} /> Try Again
                    </motion.div>
                </Link>
                <Link href={"/user/cart"}>
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.93 }}
                        className='flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all'
                    >
                        <ShoppingCart size={18} /> View Cart
                    </motion.div>
                </Link>
            </motion.div>

            {/* Secondary Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="mt-6"
            >
                <Link href={"/"} className="text-zinc-500 hover:text-green-600 text-sm font-medium flex items-center gap-2 transition-colors">
                    <Home size={16} /> Back to Home
                </Link>
            </motion.div>

            {/* Support Contact */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                className="mt-8 text-xs text-zinc-400"
            >
                Need help? <a href="mailto:support@agrowcart.com" className="text-green-600 hover:underline">Contact Support</a>
            </motion.div>

            {/* Background Decoration */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
            >
                <div className='absolute top-20 left-[10%] w-2 h-2 bg-red-300 rounded-full animate-bounce' />
                <div className='absolute top-32 left-[30%] w-2 h-2 bg-red-300 rounded-full animate-pulse' />
                <div className='absolute top-24 left-[70%] w-2 h-2 bg-red-300 rounded-full animate-bounce' />
            </motion.div>
        </div>
    )
}

export default OrderCancel

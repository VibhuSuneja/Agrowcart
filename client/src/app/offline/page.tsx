'use client'
import React from 'react'
import { WifiOff, RefreshCw, Leaf, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Leaf className="text-white w-5 h-5" />
                    </div>
                    <span className="text-zinc-800 font-black text-lg tracking-tight">
                        Agrow<span className="text-green-600">Cart</span>
                    </span>
                </Link>
            </div>

            <div className="max-w-md mx-auto space-y-8">
                <div className="w-24 h-24 bg-zinc-200 rounded-full flex items-center justify-center mx-auto">
                    <WifiOff className="text-zinc-400" size={48} />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
                        No Connection
                    </h1>
                    <p className="text-zinc-500 font-medium text-lg">
                        You appear to be offline. Please check your internet connection and try again.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-green-900/20 inline-flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={20} />
                        Try Again
                    </button>

                    <p className="text-zinc-400 text-sm">
                        Some features may be available offline once you've visited them before.
                    </p>
                </div>
            </div>

            <div className="absolute bottom-8 text-center">
                <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                    AgrowCart • Millets Value Chain Platform
                </p>
            </div>
        </div>
    )
}

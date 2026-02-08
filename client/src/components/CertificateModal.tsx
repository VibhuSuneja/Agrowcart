import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Award, ShieldCheck, Calendar, MapPin, QrCode, Download, Printer } from 'lucide-react'

interface CertificateProps {
    analysis: {
        cropType: string
        health: string
        grade: string
        issues: string[]
    }
    buyerName: string
    onClose: () => void
}

export default function CertificateModal({ analysis, buyerName, onClose }: CertificateProps) {
    const certificateId = `AC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })

    const handlePrint = () => {
        window.print()
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md print:bg-white print:p-0"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative print:shadow-none print:rounded-none print:max-w-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Controls (Hidden on Print) */}
                    <div className="absolute top-8 right-8 flex items-center gap-3 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition-all"
                            title="Print Certificate"
                        >
                            <Printer size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Certificate Body */}
                    <div className="p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

                        {/* Top Badge */}
                        <div className="mb-10 relative">
                            <div className="w-24 h-24 bg-zinc-900 rounded-3xl rotate-12 flex items-center justify-center shadow-xl shadow-zinc-900/20">
                                <Award className="text-white -rotate-12" size={48} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                                <ShieldCheck size={20} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6 relative z-10 max-w-2xl">
                            <div>
                                <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4">AgrowCart Neural Intelligence</h1>
                                <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight">Digital Quality <br />Certificate</h2>
                            </div>

                            <div className="h-px w-24 bg-zinc-200 mx-auto my-8"></div>

                            <p className="text-zinc-500 font-medium text-base md:text-lg italic leading-relaxed">
                                This document serves as an official AI-driven verification of crop quality parameters for the sample analyzed by <span className="text-zinc-900 font-bold not-italic">{buyerName}</span>.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 py-8 px-6 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                                <div className="text-center">
                                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Crop Variety</p>
                                    <p className="text-sm font-bold text-zinc-900">{analysis.cropType}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Health Metric</p>
                                    <p className="text-sm font-bold text-emerald-600">{analysis.health}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Grading</p>
                                    <p className="text-sm font-bold text-blue-600">Grade {analysis.grade}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Verification</p>
                                    <p className="text-[10px] font-black text-zinc-900 bg-zinc-200 px-2 py-0.5 rounded uppercase leading-none inline-block">Secure Pass</p>
                                </div>
                            </div>

                            {/* Issuance Footer */}
                            <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="text-left space-y-4">
                                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                        <Calendar size={14} className="text-blue-500" />
                                        <span>Issued: {date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                        <ShieldCheck size={14} className="text-blue-500" />
                                        <span>Certificate ID: {certificateId}</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4">
                                        <div className="w-12 h-0.5 bg-zinc-900"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Official AI Authenticator</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-zinc-50 rounded-3xl border border-zinc-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-zinc-200 overflow-hidden">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://agrowcart.com`)}`}
                                            alt="Verify QR"
                                            className="w-10 h-10 object-contain"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Scan to Verify</p>
                                        <p className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">agrowcart.com/verify/{certificateId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <p className="mt-16 text-[9px] font-medium text-zinc-400 max-w-md">
                            *This certificate is generated by AgrowCart's Neural Network and Large Language Model specialized in agricultural exports. All analysis is probabilistic based on visual data.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

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
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md print:bg-white print:p-0 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-3xl my-8 rounded-[3rem] overflow-hidden shadow-2xl relative print:shadow-none print:rounded-none print:max-w-none print:my-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Controls (Hidden on Print) */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between print:hidden z-20">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
                        >
                            <X size={16} />
                            <span>Back to Feed</span>
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10"
                            title="Print Certificate"
                        >
                            <Printer size={16} />
                            <span>Print Certificate</span>
                        </button>
                    </div>

                    {/* Certificate Body */}
                    <div className="p-10 md:p-14 pt-24 flex flex-col items-center text-center relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

                        {/* Top Badge */}
                        <div className="mb-6 relative">
                            <div className="w-20 h-20 bg-zinc-900 rounded-3xl rotate-12 flex items-center justify-center shadow-xl shadow-zinc-900/20">
                                <Award className="text-white -rotate-12" size={40} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                                <ShieldCheck size={16} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 relative z-10 max-w-xl">
                            <div>
                                <h1 className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2">AgrowCart Neural Intelligence</h1>
                                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight">Digital Quality <br />Certificate</h2>
                            </div>

                            <div className="h-px w-20 bg-zinc-200 mx-auto my-4"></div>

                            <p className="text-zinc-500 font-medium text-sm md:text-base italic leading-relaxed">
                                This document serves as an official AI-driven verification of crop quality parameters for the sample analyzed by <span className="text-zinc-900 font-bold not-italic">{buyerName}</span>.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 py-6 px-4 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                                <div className="text-center">
                                    <p className="text-[7px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Crop Variety</p>
                                    <p className="text-[11px] font-bold text-zinc-900 truncate">{analysis.cropType}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[7px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Health Metric</p>
                                    <p className="text-[11px] font-bold text-emerald-600">{analysis.health}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[7px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Grading</p>
                                    <p className="text-[11px] font-bold text-blue-600">Grade {analysis.grade}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[7px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Verification</p>
                                    <p className="text-[9px] font-black text-zinc-900 bg-zinc-200 px-1.5 py-0.5 rounded uppercase leading-none inline-block">Secure Pass</p>
                                </div>
                            </div>

                            {/* Issuance Footer */}
                            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-left space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                        <Calendar size={12} className="text-blue-500" />
                                        <span>Issued: {date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                        <ShieldCheck size={12} className="text-blue-500" />
                                        <span>ID: {certificateId}</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="w-8 h-0.5 bg-zinc-900"></div>
                                        <span className="text-[8px] font-black uppercase tracking-widest">Official AI Authenticator</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-zinc-50 rounded-[1.5rem] border border-zinc-100 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-zinc-200 overflow-hidden">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://agrowcart.com`)}`}
                                            alt="Verify QR"
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[7px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Scan to Verify</p>
                                        <p className="text-[9px] font-bold text-blue-600 hover:underline cursor-pointer tracking-tight">agrowcart.com/verify/{certificateId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <p className="mt-10 text-[8px] font-medium text-zinc-400 max-w-sm">
                            *This certificate is generated by AgrowCart Neural Network. All analysis is probabilistic based on visual data provided during the session.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

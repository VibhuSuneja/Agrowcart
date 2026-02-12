'use client'
import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShieldCheck, Info, FileText, Download, Gavel, AlertTriangle, Printer, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Clause {
    title: string
    originalText: string
    plainLanguage: string
    impact: string
}

interface ContractViewerProps {
    data: {
        contractTitle: string
        content: string
        criticalClauses: Clause[]
        legalFootnote: string
    }
    onClose: () => void
}

const ContractViewer: React.FC<ContractViewerProps> = ({ data, onClose }) => {
    const printRef = useRef<HTMLDivElement>(null)

    const handlePrint = () => {
        const printContent = printRef.current
        if (!printContent) return

        const win = window.open('', '', 'width=900,height=900')
        if (!win) return

        win.document.write(`
            <html>
                <head>
                    <title>${data.contractTitle}</title>
                    <style>
                        body { font-family: serif; padding: 40px; line-height: 1.6; color: #333; }
                        h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
                        .footnote { margin-top: 50px; font-size: 10px; border-top: 1px solid #ccc; padding-top: 10px; font-style: italic; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `)
        win.document.close()
        win.print()
        win.close()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8"
        >
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                className="relative w-full max-w-6xl h-[85vh] bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-3xl border border-white/20 flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Holographic Header Decor */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                {/* Sidebar: Critical Clauses (Plain Language) */}
                <div className="w-full md:w-[380px] border-r border-zinc-100 dark:border-white/5 p-8 flex flex-col bg-zinc-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-indigo-500/20 text-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg leading-none">Smart Insight</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Plain-Language Summary</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                        {data.criticalClauses.map((clause, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="group p-5 bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-2 h-2 rounded-full ${clause.impact === 'High' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{clause.title}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-zinc-200 leading-relaxed mb-3">
                                    {clause.plainLanguage}
                                </p>
                                <div className="flex items-start gap-2 p-3 bg-zinc-50 dark:bg-black/20 rounded-xl">
                                    <Gavel size={14} className="text-zinc-400 mt-1 shrink-0" />
                                    <p className="text-[10px] text-zinc-500 italic leading-snug line-clamp-2">
                                        "{clause.originalText}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-white/5">
                        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                            <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-tight uppercase">
                                For informational purposes only. Consult legal counsel before signing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content: The Contract */}
                <div className="flex-1 flex flex-col relative">
                    <div className="p-8 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center shadow-xl">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{data.contractTitle}</h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrint}
                                className="p-3 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 rounded-xl transition-all"
                                title="Print / Save PDF"
                            >
                                <Printer size={20} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                            >
                                Close Document
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 md:p-20 relative bg-[#fcfcfc] dark:bg-zinc-950/20">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

                        <div ref={printRef} className="max-w-3xl mx-auto dark:text-zinc-300">
                            <div className="prose prose-zinc dark:prose-invert max-w-none">
                                <ReactMarkdown>
                                    {data.content}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-white/10">
                                <p className="text-[10px] text-zinc-400 text-center italic">
                                    {data.legalFootnote}
                                </p>
                            </div>

                            {/* Signatures Placeholder */}
                            <div className="mt-12 grid grid-cols-2 gap-20 pb-20 no-print">
                                <div className="space-y-4">
                                    <div className="h-px bg-zinc-300 dark:bg-zinc-700 w-full" />
                                    <p className="text-xs font-bold text-zinc-500">Authorized Signature (Producer)</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-px bg-zinc-300 dark:bg-zinc-700 w-full" />
                                    <p className="text-xs font-bold text-zinc-500">Authorized Signature (Procurement Agency)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ContractViewer

'use client'
import React from 'react'
import { Briefcase, ArrowRight, ShieldCheck, Zap, Coins, Sprout } from 'lucide-react'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'

const SCHEMES = [
    {
        id: 'PM-KISAN',
        title: 'PM-KISAN',
        desc: '₹6,000/year income support for landholding farmer families.',
        icon: <Coins size={18} className="text-green-600" />,
        premium: false,
        url: 'https://pmkisan.gov.in/'
    },
    {
        id: 'PMFBY',
        title: 'Fasal Bima Yojana',
        desc: 'Full crop insurance coverage against natural calamities.',
        icon: <ShieldCheck size={18} className="text-blue-600" />,
        premium: false,
        url: 'https://pmfby.gov.in/'
    },
    {
        id: 'PM-KUSUM',
        title: 'PM-KUSUM (Solar)',
        desc: 'Subsidies for solar pumps & setting up solar plants on barren land.',
        icon: <Zap size={18} className="text-yellow-600" />,
        premium: true,
        url: 'https://pmkusum.mnre.gov.in/'
    },
    {
        id: 'AIF',
        title: 'Agri Infra Fund',
        desc: 'Financing for post-harvest management infrastructure.',
        icon: <Briefcase size={18} className="text-purple-600" />,
        premium: false,
        url: 'https://agriinfra.dac.gov.in/'
    },
    {
        id: 'e-NAM',
        title: 'e-NAM Market',
        desc: 'Online trading platform for better price discovery.',
        icon: <Sprout size={18} className="text-emerald-600" />,
        premium: false,
        url: 'https://enam.gov.in/'
    }
]

export default function SchemesCard() {
    const handleOpen = (url: string, title: string) => {
        toast.success(`Opening ${title} Portal...`)
        window.open(url, '_blank')
    }

    return (
        <div className="bg-green-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-green-900/40 relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 mb-6">
                <div className="flex items-center gap-2 text-white/70 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                    <Briefcase size={14} />
                    <span>Government Aid</span>
                </div>
                <h3 className="text-3xl font-black leading-tight tracking-tight">Key Support <br />Schemes</h3>
            </div>

            <div className="space-y-3 relative z-10 flex-1 overflow-y-auto custom-scrollbar-white pr-2">
                {SCHEMES.map((scheme, i) => (
                    <motion.div
                        key={scheme.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl cursor-pointer group backdrop-blur-md transition-all"
                        onClick={() => handleOpen(scheme.url, scheme.title)}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                    {scheme.icon}
                                </div>
                                <h4 className="font-bold text-sm">{scheme.title}</h4>
                            </div>
                            <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-[10px] text-white/80 font-medium ml-9 leading-relaxed">
                            {scheme.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={() => handleOpen('https://www.myscheme.gov.in/', 'Eligibility Checker')}
                className="mt-6 bg-white text-green-700 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] w-full hover:bg-green-50 transition-colors relative z-10 flex items-center justify-center gap-2 shadow-lg"
            >
                Check Eligibility <ArrowRight size={12} />
            </button>
        </div>
    )
}

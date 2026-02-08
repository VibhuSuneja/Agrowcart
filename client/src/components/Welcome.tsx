'use client'
import React from 'react'
import { motion } from "motion/react"
import { ArrowRight, Leaf, Sparkles, TrendingUp } from 'lucide-react'

type propType = {
   nextStep: (s: number) => void
}
function Welcome({ nextStep }: propType) {
   return (
      <div className='flex flex-col items-center justify-center min-h-screen text-center p-4 bg-zinc-50 relative overflow-x-hidden overflow-y-auto custom-scrollbar'>
         {/* Background Ambience */}
         <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200/40 rounded-full blur-[80px] animate-pulse pointer-events-none' />
         <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/40 rounded-full blur-[80px] animate-pulse delay-1000 pointer-events-none' />

         <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className='relative z-10 flex flex-col items-center'
         >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl shadow-xl shadow-green-500/20 flex items-center justify-center mb-6 rotate-3">
               <Leaf className="text-white w-8 h-8" />
            </div>

            <h1 className='text-4xl md:text-6xl font-black text-zinc-900 tracking-tight leading-tight'>
               Agrow<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Cart</span>
            </h1>

            <div className="flex items-center gap-2 mt-3 bg-white/60 backdrop-blur-md border border-white/40 px-3 py-1 rounded-full shadow-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Farm to Fork Revolution</span>
            </div>
         </motion.div>

         <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='mt-6 text-zinc-500 text-base md:text-lg max-w-md font-medium leading-relaxed relative z-10'
         >
            Empowering farmers and nourishing families with
            <span className="text-zinc-800 font-bold mx-1">premium organic millets</span>
            directly from the source.
         </motion.p>

         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='flex items-center justify-center gap-6 mt-8 relative z-10'
         >
            <div className="flex flex-col items-center gap-2">
               <div className="w-14 h-14 rounded-2xl bg-white border border-green-100 shadow-xl flex items-center justify-center text-green-600">
                  <TrendingUp size={24} />
               </div>
               <span className="text-[9px] font-black uppercase text-zinc-400">Fair Price</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-14 h-14 rounded-2xl bg-white border border-green-100 shadow-xl flex items-center justify-center text-emerald-600">
                  <Sparkles size={24} />
               </div>
               <span className="text-[9px] font-black uppercase text-zinc-400">Premium</span>
            </div>
         </motion.div>

         <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className='group relative z-10 inline-flex items-center gap-3 bg-zinc-900 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-green-500/30 transition-all duration-300 mt-10 overflow-hidden text-sm'
            onClick={() => nextStep(2)}
         >
            <span className="relative z-10">Join the Revolution</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
         </motion.button>

      </div>
   )
}

export default Welcome



'use client'
import { Box, ChevronLeft, ChevronRight, Cookie, Leaf, Package, Wheat } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from "motion/react"
import Link from 'next/link'

function CategorySlider() {
  const categories = [
    { id: 1, name: "Raw Millets", icon: Wheat, color: "from-emerald-500/10 to-emerald-500/5", iconColor: "text-emerald-500" },
    { id: 2, name: "Millet Rice", icon: Box, color: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-500" },
    { id: 3, name: "Millet Flour", icon: Wheat, color: "from-green-500/10 to-green-500/5", iconColor: "text-green-500" },
    { id: 4, name: "Millet Snacks", icon: Cookie, color: "from-orange-500/10 to-orange-500/5", iconColor: "text-orange-500" },
    { id: 5, name: "Value-Added", icon: Package, color: "from-blue-500/10 to-blue-500/5", iconColor: "text-blue-500" },
    { id: 6, name: "Seeds", icon: Leaf, color: "from-lime-500/10 to-lime-500/5", iconColor: "text-lime-500" },
    { id: 7, name: "Organic Mix", icon: Box, color: "from-purple-500/10 to-purple-500/5", iconColor: "text-purple-500" },
  ]

  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = direction === "left" ? -400 : 400
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 10)
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    const currentRef = scrollRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll)
      checkScroll()
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      currentRef?.removeEventListener("scroll", checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  return (
    <motion.div
      className='w-[95%] lg:w-[90%] max-w-[1600px] mx-auto mt-20 relative'
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
            <Leaf size={14} className="animate-pulse" />
            <span>Product Taxonomy</span>
          </div>
          <h2 className='text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter'>Shop by Category</h2>
        </div>
        <div className="flex gap-3">
          <button
            disabled={!showLeft}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${showLeft ? 'bg-white dark:bg-zinc-900 shadow-xl hover:bg-primary hover:text-white border-zinc-100 dark:border-white/10' : 'bg-transparent text-zinc-300 border-zinc-100 dark:border-white/5 opacity-50'}`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <button
            disabled={!showRight}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${showRight ? 'bg-white dark:bg-zinc-900 shadow-xl hover:bg-primary hover:text-white border-zinc-100 dark:border-white/10' : 'bg-transparent text-zinc-300 border-zinc-100 dark:border-white/5 opacity-50'}`}
            onClick={() => scroll("right")}
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div
        className='flex gap-6 overflow-x-auto pb-10 scrollbar-hide scroll-smooth snap-x snap-mandatory'
        ref={scrollRef}
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.id}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="snap-start"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className={`min-w-[160px] md:min-w-[210px] aspect-square flex flex-col items-center justify-center rounded-[3rem] bg-linear-to-br ${cat.color} p-8 cursor-pointer shadow-2xl shadow-zinc-900/5 hover:shadow-primary/20 backdrop-blur-xl border border-white/20 dark:border-white/5 transition-all duration-500 group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className={`w-16 h-16 rounded-[1.5rem] bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                  <Icon size={32} strokeWidth={2.5} className={cat.iconColor} />
                </div>

                <p className={`text-center text-sm md:text-base font-black tracking-tight text-slate-800 dark:text-zinc-300 relative z-10 uppercase tracking-[0.1em]`}>
                  {cat.name}
                </p>

                <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-30 transition-opacity translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <ChevronRight size={40} className={cat.iconColor} />
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}

export default CategorySlider


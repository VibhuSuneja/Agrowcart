'use client'
import { Box, ChevronLeft, ChevronRight, Cookie, Leaf, Package, Wheat } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from "motion/react"

function CategorySlider() {
  const categories = [
    { id: 1, name: "Raw Millets", icon: Wheat, color: "bg-green-100", textColor: "text-green-700" },
    { id: 2, name: "Millet Rice", icon: Box, color: "bg-amber-100", textColor: "text-amber-700" },
    { id: 3, name: "Millet Flour", icon: Wheat, color: "bg-emerald-100", textColor: "text-emerald-700" },
    { id: 4, name: "Millet Snacks", icon: Cookie, color: "bg-orange-100", textColor: "text-orange-700" },
    { id: 5, name: "Value-Added", icon: Package, color: "bg-blue-100", textColor: "text-blue-700" },
    { id: 6, name: "Seeds", icon: Leaf, color: "bg-lime-100", textColor: "text-lime-700" },
    { id: 7, name: "Organic Mix", icon: Box, color: "bg-indigo-100", textColor: "text-indigo-700" },
  ]

  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = direction === "left" ? -300 : 300
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
    }
    return () => currentRef?.removeEventListener("scroll", checkScroll)
  }, [])

  return (
    <motion.div
      className='w-[95%] md:w-[85%] mx-auto mt-20 relative'
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="flex items-end justify-between mb-10 px-4">
        <div>
          <h4 className="text-green-600 font-bold tracking-widest text-xs uppercase mb-2">Explore the Range</h4>
          <h2 className='text-3xl md:text-4xl font-black text-zinc-900 tracking-tight'>Shop by Category</h2>
        </div>
        <div className="flex gap-2">
          <button
            disabled={!showLeft}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${showLeft ? 'bg-white shadow-xl hover:bg-green-600 hover:text-white border border-zinc-100' : 'bg-zinc-50 text-zinc-300'}`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            disabled={!showRight}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${showRight ? 'bg-white shadow-xl hover:bg-green-600 hover:text-white border border-zinc-100' : 'bg-zinc-50 text-zinc-300'}`}
            onClick={() => scroll("right")}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div
        className='flex gap-6 overflow-x-auto px-4 pb-8 scrollbar-hide scroll-smooth'
        ref={scrollRef}
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`min-w-[160px] md:min-w-[200px] aspect-square flex flex-col items-center justify-center rounded-[2.5rem] ${cat.color} p-6 cursor-pointer shadow-lg shadow-zinc-200/50 hover:shadow-2xl transition-all group`}
            >
              <div className={`p-4 rounded-3xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={32} className={cat.textColor} />
              </div>
              <p className={`text-center text-sm md:text-base font-black tracking-tight ${cat.textColor}`}>
                {cat.name}
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default CategorySlider


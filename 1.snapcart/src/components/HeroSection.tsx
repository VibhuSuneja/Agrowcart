'use client'
import { ArrowRight, Leaf, ShoppingBasket, Smartphone, Truck } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import { useTranslations } from '@/i18n/LanguageProvider'

import { useRouter } from 'next/navigation'

function HeroSection() {
  const t = useTranslations('homepage')
  const router = useRouter()

  const scrollById = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const slides = [
    {
      id: 1,
      icon: <Leaf className="w-12 h-12 text-green-400" />,
      tagline: "AGRICULTURE 4.0",
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      btnText: t('hero.shopNow'),
      action: () => scrollById('product-grid'), // Requires adding id="product-grid" to product listing
      bg: "https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      icon: <Truck className="w-12 h-12 text-emerald-400" />,
      tagline: "LOGISTICS REIMAGINED",
      title: "Efficient Farm-to-Fork Value Chain",
      subtitle: "Revolutionizing how nutritional millets reach the masses with fair pricing and real-time traceability.",
      btnText: "Track Freshness",
      action: () => router.push('/user/my-orders'),
      bg: "https://images.unsplash.com/photo-1683553170878-049f180627b0?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 3,
      icon: <Smartphone className="w-12 h-12 text-lime-400" />,
      tagline: "DIGITAL EMPOWERMENT",
      title: "Empowering Rural Farmers with AI",
      subtitle: "Leveraging technology for better crop analysis and market intelligence to double farmer incomes.",
      btnText: "Join Movement",
      action: () => router.push('/register'),
      bg: "https://plus.unsplash.com/premium_photo-1663091378026-7bee6e1c7247?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className='relative w-full h-[90vh] md:h-[85vh] mt-4 rounded-3xl overflow-hidden group'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          exit={{ opacity: 0, scale: 0.95 }}
          className='absolute inset-0'
        >
          <Image
            src={slides[current]?.bg}
            fill
            alt='Millet Platform Hero'
            priority
            className='object-cover'
          />
          <div className='absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/70' />
        </motion.div>
      </AnimatePresence>

      <div className='absolute inset-0 flex items-center px-8 md:px-20'>
        <div className='max-w-4xl space-y-8'>
          <motion.div
            key={`tag-${current}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='flex items-center gap-3'
          >
            <div className='bg-green-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-green-500/30'>
              <span className='text-green-400 text-xs font-bold tracking-widest uppercase'>{slides[current].tagline}</span>
            </div>
          </motion.div>

          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-6'
          >
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl'>
              {slides[current].title.split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase() === 'millet' || word.toLowerCase() === 'farmers' ? 'text-green-400' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className='text-xl md:text-2xl text-zinc-100 max-w-2xl font-medium leading-relaxed opacity-90'>
              {slides[current].subtitle}
            </p>
          </motion.div>

          <motion.div
            key={`btns-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='flex flex-wrap gap-4'
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#22c55e' }}
              whileTap={{ scale: 0.95 }}
              onClick={slides[current].action}
              suppressHydrationWarning
              className='bg-green-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-green-900/40 transition-colors cursor-pointer'
            >
              {slides[current].btnText}
              <ArrowRight size={20} />
            </motion.button>

            <button
              onClick={() => scrollById('mission-story')}
              suppressHydrationWarning
              className='bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold transition-all cursor-pointer'
            >
              Our Story
            </button>
          </motion.div>
        </div>
      </div>

      <div className='absolute bottom-10 right-10 flex flex-col gap-4'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            suppressHydrationWarning
            className={`h-1.5 transition-all duration-500 rounded-full ${index === current ? "w-12 bg-green-500" : "w-6 bg-white/30 hover:bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection


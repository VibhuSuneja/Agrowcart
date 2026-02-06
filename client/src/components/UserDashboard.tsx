'use client'

import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import Product, { IProduct } from '@/models/product.model'
import ProductItemCard from './ProductItemCard'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import FeedbackSection from './FeedbackSection'
import MissionStory from './MissionStory'
import ReviewMarquee from './ReviewMarquee'
import { useTranslations } from '@/i18n/LanguageProvider'
import TutorialGuide from './TutorialGuide'

function UserDashboard({ productList }: { productList: IProduct[] }) {
  const t = useTranslations('products')
  const tCommon = useTranslations('common')
  const CONSUMER_TOUR_STEPS = [
    {
      targetId: 'home-hero',
      title: 'Welcome to AgrowCart',
      content: 'Your gateway to farm-fresh, sustainable produce. Explore our curated selection of organic millets and value-added goods.'
    },
    {
      targetId: 'home-categories',
      title: 'Shop by Category',
      content: 'Looking for something specific? Browse our diverse range of millet-based products, from raw grains to ready-to-eat snacks.'
    },
    {
      targetId: 'product-grid',
      title: 'Fresh Arrivals',
      content: 'Check out the latest harvests listed directly by farmers and SHGs. Transparent pricing and full traceability guaranteed.'
    }
  ]

  const [reviewsRefreshKey, setReviewsRefreshKey] = React.useState(0)

  const handleFeedbackRefresh = () => {
    setReviewsRefreshKey(prev => prev + 1)
  }

  return (
    <div className="bg-white dark:bg-background-dark min-h-screen pb-32">
      <div id="home-hero" className="relative group">
        <HeroSection />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white dark:to-background-dark pointer-events-none" />
      </div>

      <div id="home-categories" className="relative z-10 -mt-20">
        <CategorySlider />
      </div>

      <div id='product-grid' className='w-[95%] lg:w-[90%] max-w-[1600px] mx-auto mt-24 md:mt-40'>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
              <Sparkles size={14} className="animate-pulse" />
              <span>Premium Marketplace</span>
            </div>
            <h2 className='text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none'>
              {t('title')}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-lg font-medium leading-relaxed">
              Discover our highest-rated products, handpicked from organic farms for their nutritional excellence and full traceability.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Inventory Status</span>
              <span className="text-2xl font-black text-slate-800 dark:text-primary">{productList.length}+ Batches</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl agrow-glow group cursor-pointer hover:scale-110 transition-transform">
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10'>
          {productList.map((item: any, index: number) => (
            <ProductItemCard key={item._id || index} item={item} />
          ))}
        </div>

        {productList.length === 0 && (
          <div className="py-24 text-center glass-panel rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner overflow-hidden relative group">
              <Sparkles className="text-primary group-hover:scale-125 transition-transform" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">No products found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">We're currently stocking up on the freshest harvests. Check back in a few moments!</p>
          </div>
        )}
      </div>

      <div className="mt-40 space-y-40">
        <MissionStory />
        <ReviewMarquee key={reviewsRefreshKey} />
        <FeedbackSection onReviewSubmitted={handleFeedbackRefresh} />
      </div>

      <TutorialGuide steps={CONSUMER_TOUR_STEPS} tourName="consumer_v1" />
    </div>
  )
}

export default UserDashboard


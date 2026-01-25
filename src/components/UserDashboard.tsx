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

  return (
    <div className="bg-white pb-20">
      <div id="home-hero">
        <HeroSection />
      </div>

      <div id="home-categories">
        <CategorySlider />
      </div>

      <div id='product-grid' className='w-[95%] md:w-[85%] mx-auto mt-32'>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-[0.2em] text-xs">
              <Sparkles size={16} />
              <span>Curated Selection</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-black text-zinc-900 tracking-tight'>{t('title')}</h2>
            <p className="text-zinc-500 max-w-lg font-medium">Discover our highest-rated products, handpicked from organic farms across the country for their nutritional excellence.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Produce</span>
              <span className="text-xl font-black text-zinc-900">{productList.length}+ Batches</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xl shadow-zinc-900/20">
              <ArrowRight size={20} />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10'>
          {productList.map((item: any, index: number) => (
            <ProductItemCard key={index} item={item} />
          ))}
        </div>

        {productList.length === 0 && (
          <div className="py-20 text-center bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Sparkles className="text-zinc-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
            <p className="text-zinc-500">We're currently stocking up on the freshest harvests. Check back soon!</p>
          </div>
        )}
      </div>

      <MissionStory />
      <ReviewMarquee />
      <FeedbackSection />
      <TutorialGuide steps={CONSUMER_TOUR_STEPS} tourName="consumer_v1" />
    </div>
  )
}

export default UserDashboard


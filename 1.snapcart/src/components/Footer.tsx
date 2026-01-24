'use client'
import React from 'react'
import { motion } from "motion/react"
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, TwitterIcon } from 'lucide-react'

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-zinc-900 text-white mt-20 relative overflow-hidden"
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 via-green-400 to-green-600"></div>

      <div className='w-[90%] md:w-[80%] mx-auto py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10'>
        <div className="space-y-4">
          <h2 className='text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500'>Millet Platform</h2>
          <p className='text-zinc-400 text-sm leading-relaxed max-w-xs'>
            Revolutionizing the millet value chain through AI-driven insights, farm-to-fork traceability, and direct market access for farmers and buyers.
          </p>
          <div className="flex gap-4 pt-2">
            <Link href="https://www.linkedin.com/in/vibhusuneja08?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" className='p-2 bg-zinc-800 rounded-full hover:bg-green-600 transition-all duration-300'>
              <Linkedin size={18} />
            </Link>
            <Link href="https://www.instagram.com/o_.vibhu._o?igsh=enFnaGNuNDQ5OWpo" target="_blank" className='p-2 bg-zinc-800 rounded-full hover:bg-pink-600 transition-all duration-300'>
              <Instagram size={18} />
            </Link>
            <Link href="mailto:vibhusun01@gmail.com" className='p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-all duration-300'>
              <Mail size={18} />
            </Link>
          </div>
        </div>

        <div>
          <h2 className='text-lg font-bold mb-6 border-l-4 border-green-500 pl-3'>Quick Explore</h2>
          <ul className='space-y-3 text-zinc-400 text-sm'>
            <li><Link href={"/"} className='hover:text-green-400 transition-colors flex items-center gap-2'><span className="h-1 w-1 bg-green-500 rounded-full"></span>Home</Link></li>
            <li><Link href={"/user/cart"} className='hover:text-green-400 transition-colors flex items-center gap-2'><span className="h-1 w-1 bg-green-500 rounded-full"></span>Marketplace</Link></li>
            <li><Link href={"/user/my-orders"} className='hover:text-green-400 transition-colors flex items-center gap-2'><span className="h-1 w-1 bg-green-500 rounded-full"></span>My Orders</Link></li>
            <li><Link href={"#"} className='hover:text-green-400 transition-colors flex items-center gap-2'><span className="h-1 w-1 bg-green-500 rounded-full"></span>AI Insights</Link></li>
          </ul>
        </div>

        <div>
          <h2 className='text-lg font-bold mb-6 border-l-4 border-green-500 pl-3'>Industry Roles</h2>
          <ul className='space-y-3 text-zinc-400 text-sm'>
            <li><Link href={"/farmer-dashboard"} className='hover:text-green-400 transition-colors flex items-center gap-2'>Farmer & SHG</Link></li>
            <li><Link href={"/buyer-marketplace"} className='hover:text-green-400 transition-colors flex items-center gap-2'>Processors & Startups</Link></li>
            <li><Link href={"/"} className='hover:text-green-400 transition-colors flex items-center gap-2'>Delivery Partners</Link></li>
            <li><Link href={"/"} className='hover:text-green-400 transition-colors flex items-center gap-2'>Administrators</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6 border-l-4 border-green-500 pl-3">Contact Center</h3>
          <ul className="space-y-4 text-zinc-400 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-green-500 shrink-0" />
              <Link href="https://www.google.com/maps/search/?api=1&query=Kurukshetra+Haryana" target="_blank" className="hover:text-green-400 transition-colors">
                Innovating from Kurukshetra, Haryana
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-green-500 shrink-0" />
              <span>+91 94681 50076</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-green-500 shrink-0" />
              <span>vibhusun01@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[80%] mx-auto gap-4">
          <p>© {new Date().getFullYear()} Millet Platform. </p>
          <p className="font-medium">
            Made with ❤️ by <Link
              href="https://www.linkedin.com/in/vibhusuneja08"
              target="_blank"
              className="text-green-400 hover:text-green-300 transition-colors underline underline-offset-4"
            >Vibhu Suneja</Link> • <Link href="mailto:vibhusun01@gmail.com" className="text-zinc-400 hover:text-green-400 transition-colors">vibhusun01@gmail.com</Link>
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer


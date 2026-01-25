import { ArrowLeft, EyeIcon, EyeOff, Key, Leaf, Loader2, Lock, LogIn, Mail, Sparkles, User, UserCheck } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import googleImage from "@/assets/google.png"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

type propType = {
  previousStep: (s: number) => void
}

function RegisterForm({ previousStep }: propType) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post("/api/auth/register", {
        name, email, password, role
      })
      toast.success("Account created successfully!")
      router.push("/login")
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-zinc-50 relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-green-300/40 to-emerald-300/40 rounded-full blur-[120px] animate-pulse duration-[4000ms]' />
      <div className='absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-lime-300/40 to-green-300/40 rounded-full blur-[120px] animate-pulse duration-[5000ms]' />

      <div className='absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-green-600 transition-all cursor-pointer group'
        onClick={() => previousStep(1)}
      >
        <div className='w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform'>
          <ArrowLeft size={18} />
        </div>
        <span className='font-bold text-sm tracking-tight'>Go Back</span>
      </div>

      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-green-900/5 border border-zinc-100 relative z-10 transition-all hover:shadow-green-900/10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl shadow-xl shadow-green-500/30 flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-all duration-300">
            <Leaf className="text-white drop-shadow-md" size={40} />
          </div>
          <h1 className='text-4xl font-black text-zinc-900 tracking-tight mb-2'>
            Join <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600'>AgrowCart</span>
          </h1>
          <p className='text-zinc-500 text-sm font-medium flex items-center gap-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-100'>
            <Sparkles size={14} className='text-green-500' />
            India's Premier Millet Network
          </p>
        </div>

        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col gap-4'
        >
          <div className='relative group'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type="text"
              placeholder='Full Name'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-sm'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type="email"
              placeholder='Email Address'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-sm'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Secure Password'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-12 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-sm'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              type="button"
              className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-green-500 transition-colors'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          <div className='relative group'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors pointer-events-none' />
            <select
              className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-sm appearance-none cursor-pointer'
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value="user">Household Consumer</option>
              <option value="buyer">Corporate / Bulk Buyer</option>
              <option value="farmer">Millet Farmer</option>
              <option value="shg">Self Help Group (SHG)</option>
              <option value="startup">Agi-Startup / Entrepreneur</option>
              <option value="processor">Food Processor</option>
              <option value="deliveryBoy">Delivery Partner</option>
            </select>
            <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-green-500 transition-colors'>
              <ArrowLeft size={16} className='rotate-[270deg]' />
            </div>
          </div>

          <button
            disabled={!name || !email || !password || loading}
            className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl inline-flex items-center justify-center gap-2 mt-2 ${(!name || !email || !password || loading)
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-green-900/20 hover:scale-[1.02] active:scale-100"
              }`}
          >
            {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : (
              <>
                <span>Get Started Now</span>
                <Sparkles size={18} />
              </>
            )}
          </button>

          <div className='flex items-center gap-4 py-2'>
            <div className='flex-1 h-px bg-zinc-100' />
            <span className='text-[10px] font-black tracking-widest text-zinc-400 uppercase'>Social Integration</span>
            <div className='flex-1 h-px bg-zinc-100' />
          </div>

          <button
            type="button"
            className='w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 py-4 rounded-2xl text-zinc-700 font-bold transition-all shadow-sm group active:scale-95'
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Image src={googleImage} width={20} height={20} alt='google' className='grayscale group-hover:grayscale-0 transition-all' />
            <span>Continue with Google</span>
          </button>
        </motion.form>

        <p className='text-zinc-500 mt-10 text-sm text-center font-medium'>
          Already a member?
          <button
            onClick={() => router.push("/login")}
            className='text-green-600 font-black ml-1 hover:underline underline-offset-4'
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm


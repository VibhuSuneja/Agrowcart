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
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      toast.error("Please agree to the Terms & Privacy Policy")
      return
    }
    setLoading(true)
    try {
      await axios.post("/api/auth/register", {
        name, email, password, role, agreed
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
    <div className='flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-zinc-50 relative overflow-x-hidden overflow-y-auto custom-scrollbar'>
      {/* Decorative background elements */}
      <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-green-300/40 to-emerald-300/40 rounded-full blur-[100px] animate-pulse duration-[4000ms] pointer-events-none' />
      <div className='absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-lime-300/40 to-green-300/40 rounded-full blur-[100px] animate-pulse duration-[5000ms] pointer-events-none' />

      <div className='absolute top-4 left-4 flex items-center gap-2 text-zinc-500 hover:text-green-600 transition-all cursor-pointer group'
        onClick={() => previousStep(1)}
      >
        <div className='w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform'>
          <ArrowLeft size={16} />
        </div>
        <span className='font-bold text-xs tracking-tight'>Go Back</span>
      </div>

      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-zinc-100 relative z-10 transition-all hover:shadow-green-900/10 mt-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl shadow-xl shadow-green-500/20 flex items-center justify-center mb-4 transform rotate-3 hover:rotate-6 transition-all duration-300">
            <Leaf className="text-white drop-shadow-md" size={28} />
          </div>
          <h1 className='text-2xl font-black text-zinc-900 tracking-tight mb-1'>
            Join <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600'>AgrowCart</span>
          </h1>
          <p className='text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100'>
            <Sparkles size={12} className='text-green-500' />
            India's Premier Millet Network
          </p>
        </div>

        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col gap-3'
        >
          <div className='relative group'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type="text"
              placeholder='Full Name'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-xs'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type="email"
              placeholder='Email Address'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-xs'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Secure Password'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-10 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-xs'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              type="button"
              className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-green-500 transition-colors'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>

          <div className='relative group'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-green-500 transition-colors pointer-events-none' />
            <select
              className='w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-zinc-800 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-xs appearance-none cursor-pointer'
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
              <ArrowLeft size={14} className='rotate-[270deg]' />
            </div>
          </div>

          <button
            disabled={!name || !email || !password || loading}
            className={`w-full font-bold py-3.5 rounded-xl transition-all duration-300 shadow-xl inline-flex items-center justify-center gap-2 mt-1 ${(!name || !email || !password || loading)
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-green-900/20 hover:scale-[1.02] active:scale-100"
              }`}
          >
            {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : (
              <>
                <span className="text-sm">Get Started Now</span>
                <Sparkles size={16} />
              </>
            )}
          </button>

          <div className="flex items-start gap-3 mt-1 px-1">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-zinc-300 transition-all checked:border-green-600 checked:bg-green-600 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <label htmlFor="terms" className="text-[10px] text-zinc-500 cursor-pointer select-none leading-tight font-medium">
              I agree to the <a href="/terms" target="_blank" className="text-green-600 font-bold hover:underline">Terms</a> and <a href="/privacy" target="_blank" className="text-green-600 font-bold hover:underline">Privacy Policy</a>
            </label>
          </div>

          <div className='flex items-center gap-4 py-1'>
            <div className='flex-1 h-px bg-zinc-100' />
            <span className='text-[9px] font-black tracking-widest text-zinc-400 uppercase'>Social</span>
            <div className='flex-1 h-px bg-zinc-100' />
          </div>

          <button
            type="button"
            className='w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 py-3 rounded-xl text-zinc-700 font-bold transition-all shadow-sm group active:scale-95 text-xs'
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Image src={googleImage} width={18} height={18} alt='google' className='grayscale group-hover:grayscale-0 transition-all' />
            <span>Continue with Google</span>
          </button>
        </motion.form>

        <p className='text-zinc-500 mt-6 text-xs text-center font-medium'>
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


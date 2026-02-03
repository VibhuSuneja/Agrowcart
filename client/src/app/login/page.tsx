'use client'
import { ArrowLeft, EyeIcon, EyeOff, Key, Leaf, Loader2, Lock, LogIn, Mail, Sparkles, User, UserCheck, X } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import Image from 'next/image'
import googleImage from "@/assets/google.png"
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { TermsContent, PrivacyContent } from '@/components/LegalContent'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [legalType, setLegalType] = useState<'terms' | 'privacy'>('terms')
  const router = useRouter()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email, password,
        redirect: false
      })

      if (result?.error) {
        // NextAuth v5 returns specific error codes
        const errorCode = result.error.toLowerCase()

        // Handle NextAuth specific error codes
        if (errorCode === "credentialssignin" || errorCode === "configuration") {
          toast.error("Wrong email or password. Please try again.")
        } else if (errorCode.includes("incorrect password") || errorCode.includes("wrong password")) {
          toast.error("Wrong password! Please try again.")
        } else if (errorCode.includes("user does not exist") || errorCode.includes("not found")) {
          toast.error("User not found. Please check your email or register.")
        } else {
          toast.error("Login failed. Please check your credentials.")
        }
        setLoading(false)
        return
      }

      // Record agreement via lightweight request
      try {
        await import('axios').then(a => a.default.post("/api/user/record-terms"))
      } catch (err) { console.error("Failed to record terms", err) }

      toast.success("Welcome back to the Platform!")
      window.location.href = "/"
    } catch (error: any) {
      console.error(error)
      toast.error("Login failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-zinc-50 relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100 rounded-full blur-[100px] opacity-50' />
      <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[100px] opacity-50' />

      <div className='absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-green-600 transition-all cursor-pointer group'
        onClick={() => router.push("/")}
      >
        <div className='w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform'>
          <ArrowLeft size={18} />
        </div>
        <span className='font-bold text-sm tracking-tight'>Back to Home</span>
      </div>

      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-green-900/5 border border-zinc-100 relative z-10 transition-all hover:shadow-green-900/10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-700 rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center mb-6">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className='text-3xl font-black text-zinc-900 tracking-tight mb-2'>Welcome Back</h1>
          <p className='text-zinc-500 text-sm font-medium flex items-center gap-2'>
            Continue your Millet Journey <Sparkles size={14} className='text-green-500' />
          </p>
        </div>

        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col gap-4'
        >
          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type="email"
              placeholder='Email Address'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-sm'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Account Password'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-12 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-sm'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type="button"
              className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-green-500 transition-colors'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          <div className="flex justify-end px-1">
            <button type="button" className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors">
              Forgot Password?
            </button>
          </div>

          <button
            disabled={!email || !password || loading}
            className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl inline-flex items-center justify-center gap-2 mt-2 ${(!email || !password || loading)
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-green-900/20 hover:scale-[1.02] active:scale-100"
              }`}
          >
            {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : (
              <>
                <span>Secure Sign In</span>
                <LogIn size={18} />
              </>
            )}
          </button>

          <div className='flex items-center gap-4 py-2'>
            <div className='flex-1 h-px bg-zinc-100' />
            <span className='text-[10px] font-black tracking-widest text-zinc-400 uppercase'>OAuth Access</span>
            <div className='flex-1 h-px bg-zinc-100' />
          </div>

          <button
            type="button"
            className='w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 py-4 rounded-2xl text-zinc-700 font-bold transition-all shadow-sm group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={() => {
              signIn("google", { callbackUrl: "/" })
            }}
          >
            <Image src={googleImage} width={20} height={20} alt='google' className='grayscale group-hover:grayscale-0 transition-all' />
            <span>Continue with Google</span>
          </button>
        </motion.form>

        <p className='text-zinc-500 mt-10 text-sm text-center font-medium'>
          New to the platform?
          <button
            onClick={() => router.push("/register")}
            className='text-green-600 font-black ml-1 hover:underline underline-offset-4'
          >
            Create Account
          </button>
        </p>
      </div>

      <AnimatePresence>
        {showLegalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLegalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLegalModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                {legalType === 'terms' ? <TermsContent /> : <PrivacyContent />}
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end px-12">
                <button
                  onClick={() => setShowLegalModal(false)}
                  className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full px-4 text-center relative z-10">
        {[
          { role: "Farmer", email: "farmer@test.com" },
          { role: "Consumer", email: "consumer@test.com" },
          { role: "Corporate", email: "corporate@test.com" },
          { role: "SHG", email: "shg@test.com" },
          { role: "Processor", email: "processor@test.com" },
          { role: "Startup", email: "startup@test.com" },
          { role: "Delivery", email: "delivery@test.com" },
        ].map(creds => (
          <div key={creds.role} className="bg-white/50 hover:bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-zinc-200 text-[10px] transition-colors cursor-pointer" onClick={() => { setEmail(creds.email); setPassword('123123') }}>
            <div className="font-black uppercase tracking-widest text-green-600 mb-1">{creds.role}</div>
            <div className="font-bold text-zinc-800">{creds.email}</div>
            <div className="text-zinc-500 font-mono mt-1">Pass: 123123</div>
          </div>
        ))}
      </div>
    </div >
  )
}

export default Login


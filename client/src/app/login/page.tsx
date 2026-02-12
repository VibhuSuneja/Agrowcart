'use client'
import { ArrowLeft, EyeIcon, EyeOff, Fingerprint, Key, Leaf, Loader2, Lock, LogIn, Mail, Sparkles, User, UserCheck, WifiOff, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import React, { FormEvent, useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from "motion/react"
import Image from 'next/image'
import googleImage from "@/assets/google.png"
import { TermsContent, PrivacyContent } from '@/components/LegalContent'
import { startAuthentication } from '@simplewebauthn/browser'
import axios from 'axios'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import AccessibleModal from '@/components/AccessibleModal'

function Login() {
  const isOnline = useNetworkStatus()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [legalType, setLegalType] = useState<'terms' | 'privacy'>('terms')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      if (error === 'AccessDenied' || error.toLowerCase().includes('banned')) {
        toast.error("Your account has been deactivated by administration.")
      } else if (error === 'CredentialsSignin') {
        toast.error("Invalid email or password.")
      } else {
        toast.error("Authentication failed. Please try again.")
      }
      // Clear the error from URL without refreshing
      router.replace('/login', { scroll: false })
    }
  }, [searchParams, router])

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    try {
      const res = await axios.post('/api/auth/forgot-password', { email: forgotEmail })
      toast.success(res.data.message || "Reset link sent!")
      setShowForgotModal(false)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send reset link")
    } finally {
      setForgotLoading(false)
    }
  }

  const handlePasskeyLogin = async () => {
    if (!email) {
      toast.error("Please enter your email first to use passkey login.")
      return
    }

    setPasskeyLoading(true)
    try {
      // Step 1: Get authentication options from server
      const optionsRes = await axios.post('/api/auth/passkey/login-options', { email })
      const options = optionsRes.data

      if (!options || options.error) {
        toast.error(options?.error || "Failed to get passkey options")
        setPasskeyLoading(false)
        return
      }

      console.log("Starting Passkey Auth with options:", options)

      const authResponse = await startAuthentication({ optionsJSON: options })

      // Step 3: Send the response to the server for verification
      const verifyRes = await axios.post('/api/auth/passkey/login-verify', {
        userId: options.userId,
        response: authResponse
      })

      if (verifyRes.data.success) {
        toast.success("Biometric authentication successful!")
        window.location.href = "/"
      } else {
        toast.error(verifyRes.data.error || "Passkey verification failed")
      }
    } catch (error: any) {
      console.error("Passkey login error:", error)
      if (error.name === 'NotAllowedError') {
        // This is often just a user cancellation, so we show a subtle message
        toast.error("Authentication cancelled. Please try again or use your password.")
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error("Passkey login failed. Try password login instead.")
      }
    } finally {
      setPasskeyLoading(false)
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email, password,
        redirect: false
      })

      if (result?.error) {
        const errorCode = result.error.toLowerCase()

        // Specific checks for banned status
        if (errorCode.includes("account banned") || errorCode.includes("banned")) {
          toast.error("Your account has been deactivated by administration.")
          setLoading(false)
          return
        }

        // Fallback check if NextAuth hides the specific error message
        if (errorCode === "credentialssignin") {
          try {
            // We use a safe public check to see if the user is banned without revealing too much
            const checkRes = await axios.post('/api/auth/check-ban', { email })
            if (checkRes.data.isBanned) {
              toast.error("Your account has been deactivated by administration.")
              setLoading(false)
              return
            }
          } catch (err) {
            // Silently fail and proceed to generic error
          }
        }

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

      try {
        await axios.post("/api/user/record-terms")
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
    <div className='flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-zinc-50 relative overflow-x-hidden overflow-y-auto custom-scrollbar'>
      {/* Decorative background elements - optimized for smaller viewports */}
      <div className='absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-green-100 rounded-full blur-[80px] opacity-40 pointer-events-none' />
      <div className='absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-100 rounded-full blur-[80px] opacity-40 pointer-events-none' />

      <div className='absolute top-4 left-4 flex items-center gap-2 text-zinc-500 hover:text-green-600 transition-all cursor-pointer group'
        onClick={() => router.push("/")}
      >
        <div className='w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform'>
          <ArrowLeft size={16} />
        </div>
        <span className='font-bold text-xs tracking-tight'>Back to Home</span>
      </div>

      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-zinc-100 relative z-10 transition-all hover:shadow-green-900/10 mt-6 lg:mt-0">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center mb-4">
            <Lock className="text-white" size={24} />
          </div>
          <h1 className='text-2xl font-black text-zinc-900 tracking-tight mb-1'>Welcome Back</h1>
          <p className='text-zinc-500 text-xs font-medium flex items-center gap-2'>
            Continue your Millet Journey <Sparkles size={12} className='text-green-500' />
          </p>
        </div>

        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col gap-3'
        >
          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type="email"
              placeholder='Email Address'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-xs'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Account Password'
              className='w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-10 text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none transition-all font-medium text-xs'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type="button"
              className='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-green-500 transition-colors'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>

          <div className="flex justify-end px-1">
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email)
                setShowForgotModal(true)
              }}
              className="text-[10px] font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            disabled={!email || !password || loading || !isOnline}
            className={`w-full font-bold py-3.5 rounded-xl transition-all duration-300 shadow-xl inline-flex items-center justify-center gap-2 mt-1 ${(!email || !password || loading || !isOnline)
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-green-900/20 hover:scale-[1.02] active:scale-100"
              }`}
          >
            {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : (
              <>
                <span className="text-sm">{isOnline ? "Secure Sign In" : "Offline Mode"}</span>
                {isOnline ? <LogIn size={16} /> : <WifiOff size={16} />}
              </>
            )}
          </button>

          <div className='flex items-center gap-4 py-1'>
            <div className='flex-1 h-px bg-zinc-100' />
            <span className='text-[9px] font-black tracking-widest text-zinc-400 uppercase'>OAuth</span>
            <div className='flex-1 h-px bg-zinc-100' />
          </div>

          <button
            type="button"
            disabled={!isOnline}
            className='w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 py-3 rounded-xl text-zinc-700 font-bold transition-all shadow-sm group active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed text-xs'
            onClick={() => {
              signIn("google", { callbackUrl: "/" })
            }}
          >
            <Image src={googleImage} width={18} height={18} alt='google' className='grayscale group-hover:grayscale-0 transition-all' />
            <span>{isOnline ? "Continue with Google" : "Google Login Unavailable"}</span>
          </button>

          <div className='flex items-center gap-4 py-1 mt-1'>
            <div className='flex-1 h-px bg-zinc-100' />
            <span className='text-[9px] font-black tracking-widest text-zinc-400 uppercase'>Biometric</span>
            <div className='flex-1 h-px bg-zinc-100' />
          </div>

          <button
            type="button"
            disabled={passkeyLoading || !email}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs ${passkeyLoading || !email
              ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 text-white'
              }`}
            onClick={handlePasskeyLogin}
          >
            {passkeyLoading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <>
                <Fingerprint size={16} className='text-emerald-400' />
                <span>Sign in with Passkey</span>
              </>
            )}
          </button>

          {!email && (
            <p className="text-[9px] text-center text-zinc-400 -mt-1">
              Enter email above for passkey access
            </p>
          )}
        </motion.form>

        <div className='text-zinc-500 mt-6 text-xs text-center font-medium'>
          New to the platform?
          <button
            onClick={() => router.push("/register")}
            className='text-green-600 font-black ml-1 hover:underline underline-offset-4'
          >
            Create Account
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl w-full px-2 text-center relative z-10">
        {[
          { role: "Farmer", email: "farmer@test.com" },
          { role: "Consumer", email: "consumer@test.com" },
          { role: "Corporate", email: "corporate@test.com" },
          { role: "SHG", email: "shg@test.com" },
          { role: "Processor", email: "processor@test.com" },
          { role: "Startup", email: "startup@test.com" },
          { role: "Delivery", email: "delivery@test.com" },
        ].map(creds => (
          <div key={creds.role} className="bg-white/40 hover:bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-zinc-200 text-[9px] transition-colors cursor-pointer" onClick={() => { setEmail(creds.email); setPassword('123123') }}>
            <div className="font-black uppercase tracking-widest text-green-600 mb-0.5">{creds.role}</div>
            <div className="font-bold text-zinc-800 truncate">{creds.email}</div>
            <div className="text-zinc-500 font-mono text-[8px]">Pass: 123123</div>
          </div>
        ))}
      </div>
      <AccessibleModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Password Recovery"
        className="p-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600">
            <Key size={28} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Password Recovery</h2>
          <p className="text-zinc-500 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors' />
            <input
              type="email"
              placeholder='Email address'
              required
              className='w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium text-sm'
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </div>

          <button
            disabled={forgotLoading || !forgotEmail}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-green-900/10 flex items-center justify-center gap-2"
          >
            {forgotLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Send reset link</span>
                <Sparkles size={18} />
              </>
            )}
          </button>
        </form>
      </AccessibleModal>

      <AccessibleModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        title={legalType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0"
      >
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          {legalType === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 flex justify-end px-12">
          <button
            onClick={() => setShowLegalModal(false)}
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
          >
            Close Reader
          </button>
        </div>
      </AccessibleModal>
    </div>

  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-green-600" size={40} /></div>}>
      <Login />
    </Suspense>
  )
}


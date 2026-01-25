'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Bike, User, UserCog, Wheat, Users, ShoppingCart, Rocket, Factory, Sparkles, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function EditRoleMobile() {
  const [roles, setRoles] = useState([
    { id: "admin", label: "System Admin", icon: UserCog, desc: "Platform oversight & control" },
    { id: "user", label: "Consumer", icon: User, desc: "Buy fresh millets & products" },
    { id: "farmer", label: "Farmer", icon: Wheat, desc: "Sell crop & monitor health" },
    { id: "shg", label: "SHG", icon: Users, desc: "Self-help group production" },
    { id: "buyer", label: "Corporate Buyer", icon: ShoppingCart, desc: "Bulk procurement & trade" },
    { id: "startup", label: "Startup", icon: Rocket, desc: "Agri-tech innovation" },
    { id: "processor", label: "Processor", icon: Factory, desc: "Value addition & milling" },
    { id: "deliveryBoy", label: "Logistics Partner", icon: Bike, desc: "Fulfillment & delivery" }
  ])
  const [selectedRole, setSelectedRole] = useState("")
  const [mobile, setMobile] = useState("")
  const { update } = useSession()
  const router = useRouter()

  const handleEdit = async () => {
    try {
      await axios.post("/api/user/edit-role-mobile", { role: selectedRole, mobile })
      await update({ role: selectedRole })
      router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await axios.get("/api/check-for-admin")
        if (result.data.adminExist) {
          setRoles(prev => prev.filter(r => r.id !== "admin"))
        }
      } catch (error) {
        console.error(error)
      }
    }
    checkForAdmin()
  }, [])

  return (
    <div className='min-h-screen bg-zinc-50 flex flex-col items-center py-20 px-6'>
      <div className='max-w-4xl w-full space-y-12'>

        <div className='text-center space-y-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-600 text-xs font-black uppercase tracking-widest border border-green-100 mb-4"
          >
            <Sparkles size={14} />
            <span>Personalize your experience</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-4xl md:text-5xl font-black text-zinc-900 tracking-tight'
          >
            Who are you in the <br /><span className="text-green-600">Millet Ecosystem?</span>
          </motion.h1>
          <p className="text-zinc-500 font-medium max-w-md mx-auto">Select your primary role to unlock specialized tools and marketplace features.</p>
        </div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {roles.map((role, index) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedRole(role.id)}
                className={`group relative flex flex-col p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 ${isSelected
                  ? "border-green-600 bg-white shadow-2xl shadow-green-900/10"
                  : "border-white bg-white hover:border-zinc-200 shadow-sm"
                  }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${isSelected ? "bg-green-600 text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"}`}>
                  <Icon size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-black text-sm tracking-tight ${isSelected ? "text-green-600" : "text-zinc-900"}`}>{role.label}</h3>
                  <p className="text-[10px] text-zinc-400 font-medium leading-tight">{role.desc}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='max-w-md mx-auto space-y-8 pt-8'
        >
          <div className="space-y-4">
            <label className='text-xs font-black uppercase text-zinc-400 tracking-[0.2em] ml-2'>Identity Verification</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-600 transition-colors">
                <Bike size={20} />
              </div>
              <input
                type="tel"
                className='w-full bg-white border border-zinc-200 rounded-3xl py-6 pl-16 pr-6 text-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500 outline-none transition-all font-bold text-lg placeholder:text-zinc-200'
                placeholder='Enter 10-digit mobile number'
                maxLength={10}
                onChange={(e) => setMobile(e.target.value)}
                value={mobile}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={mobile.length !== 10 || !selectedRole}
            className={`w-full py-6 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl transition-all ${selectedRole && mobile.length === 10
              ? "bg-zinc-900 text-white shadow-zinc-900/20 hover:bg-green-600"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
              }`}
            onClick={handleEdit}
          >
            <span>Complete Setup</span>
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default EditRoleMobile


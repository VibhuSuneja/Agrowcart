'use client'
import { getSocket } from '@/lib/socket'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false })
import DeliveryChat from './DeliveryChat'
import { motion, AnimatePresence } from 'motion/react'
import { Loader, Truck, Navigation2, CheckCircle2, MessageSquare, IndianRupee, MapPin, Package, RefreshCcw, Bell, X, ShieldCheck } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import toast from 'react-hot-toast'

interface ILocation {
  latitude: number,
  longitude: number
}

function DeliveryBoyDashboard({ earning }: { earning: number }) {
  const [assignments, setAssignments] = useState<any[]>([])
  const { userData } = useSelector((state: RootState) => state.user)
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [sendOtpLoading, setSendOtpLoading] = useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 })
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 })

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments")
      setAssignments(result.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const socket = getSocket()
    if (!userData?._id) return
    if (!navigator.geolocation) return
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setDeliveryBoyLocation({ latitude: lat, longitude: lon })
      socket.emit("update-location", { userId: userData?._id, latitude: lat, longitude: lon })
    }, (err) => console.error(err), { enableHighAccuracy: true })
    return () => navigator.geolocation.clearWatch(watcher)
  }, [userData?._id])

  useEffect((): any => {
    const socket = getSocket()
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment])
      toast.success("New Delivery Assignment!")
    })
    return () => socket.off("new-assignment")
  }, [])

  const handleAccept = async (id: string) => {
    try {
      await axios.post(`/api/delivery/assignment/${id}/accept-assignment`)
      toast.success("Assignment Accepted!")
      fetchCurrentOrder()
    } catch (error) {
      toast.error("Failed to accept assignment")
    }
  }

  const handleReject = async (id: string) => {
    try {
      await axios.post(`/api/delivery/assignment/${id}/reject-assignment`)
      toast.error("Assignment Rejected")
      fetchAssignments()
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order")
      if (result.data?.active) {
        setActiveOrder(result.data.assignment)
        if (result.data.assignment?.order?.address) {
          setUserLocation({
            latitude: result.data.assignment.order.address.latitude,
            longitude: result.data.assignment.order.address.longitude
          })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCurrentOrder()
    fetchAssignments()
  }, [userData])

  const sendOtp = async () => {
    const orderId = activeOrder?.order?._id
    console.log("Debugging Send OTP:", { activeOrder, orderId }) // Debug log

    if (!orderId) {
      toast.error("Error: Order ID missing. Please refresh.")
      return
    }

    setSendOtpLoading(true)
    try {
      await axios.post("/api/delivery/otp/send", { orderId })
      setShowOtpBox(true)
      toast.success("OTP sent to Customer")
    } catch (error: any) {
      console.error("Send OTP Error:", error)
      toast.error(error.response?.data?.message || "Failed to send OTP")
    } finally {
      setSendOtpLoading(false)
    }
  }

  const verifyOtp = async () => {
    setVerifyOtpLoading(true)
    try {
      await axios.post("/api/delivery/otp/verify", { orderId: activeOrder?.order?._id, otp })
      toast.success("Delivery Successful!")
      setActiveOrder(null)
      await fetchCurrentOrder()
      window.location.reload()
    } catch (error) {
      setOtpError("Incorrect OTP provided")
      toast.error("Verification failed")
    } finally {
      setVerifyOtpLoading(false)
    }
  }

  if (!activeOrder && assignments.length === 0) {
    const analytics = [{ name: "Today", earnings: earning, deliveries: Math.round(earning / 40) }]
    return (
      <div className='min-h-screen bg-zinc-50 pt-[120px] pb-20'>
        <div className='w-[95%] md:w-[85%] mx-auto max-w-lg'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 text-center space-y-8"
          >
            <div className="w-24 h-24 bg-linear-to-br from-green-500 to-emerald-700 rounded-3xl shadow-xl shadow-green-500/20 flex items-center justify-center mx-auto">
              <Truck className="text-white" size={48} />
            </div>
            <div className="space-y-2">
              <h2 className='text-3xl font-black text-zinc-900 tracking-tight'>Scanning for Orders</h2>
              <p className='text-zinc-500 font-medium'>You are currently online. Stay nearby to grab high-value deliveries.</p>
            </div>

            <div className='bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 space-y-6'>
              <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[10px] justify-center">
                <Bell size={14} />
                <span>Shift Performance</span>
              </div>
              <div className='h-[150px] min-h-[150px] w-full'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Array.isArray(analytics) ? analytics : []}>
                    <Bar dataKey="earnings" fill="#16A34A" radius={[10, 10, 0, 0]} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center px-4">
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase text-zinc-400">Total</div>
                  <div className="text-xl font-black text-zinc-900">₹{earning}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-zinc-400">Deliveries</div>
                  <div className="text-xl font-black text-green-600">{Math.round(earning / 40)}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='bg-zinc-900 text-white font-black py-5 rounded-2xl shadow-xl'
                onClick={fetchAssignments}
              >
                <div className="flex flex-col items-center">
                  <RefreshCcw size={20} className="mb-1" />
                  <span className="text-[10px] uppercase tracking-widest leading-none">Check New</span>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='bg-white border border-zinc-200 text-zinc-900 font-black py-5 rounded-2xl shadow-xl'
                onClick={() => window.location.reload()}
              >
                <div className="flex flex-col items-center">
                  <Activity size={20} className="mb-1" />
                  <span className="text-[10px] uppercase tracking-widest leading-none">Go Online</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (activeOrder && userLocation) {
    return (
      <div className='min-h-screen bg-zinc-50 pt-[120px] pb-20'>
        <div className='w-[95%] md:w-[85%] mx-auto max-w-4xl space-y-8'>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px]">
                <Activity size={14} className="animate-pulse" />
                <span>Active Delivery Protocol</span>
              </div>
              <h1 className='text-4xl font-black text-zinc-900 tracking-tight'>Live Mission</h1>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">ID: #{activeOrder?.order?._id?.toString()?.slice(-6).toUpperCase() || 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className='rounded-[3rem] border border-zinc-100 shadow-2xl shadow-blue-500/5 overflow-hidden h-[450px] relative bg-white'>
                <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
              </div>
              <DeliveryChat orderId={activeOrder?.order?._id} deliveryBoyId={userData?._id?.toString()!} />
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                    <MapPin size={16} />
                    <span>Drop-off Point</span>
                  </div>
                  <p className="text-lg font-bold text-zinc-900 leading-tight">{activeOrder?.order?.address?.fullAddress}</p>
                </div>

                <div className="pt-8 border-t border-zinc-50 space-y-6">
                  {!activeOrder?.order?.deliveryOtpVerification && !showOtpBox && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendOtp}
                      className='w-full py-6 bg-green-600 font-black text-white rounded-3xl shadow-xl shadow-green-900/20 flex items-center justify-center gap-3'
                    >
                      {sendOtpLoading ? <Loader size={20} className='animate-spin' /> : (
                        <>
                          <span>Arrived at Location</span>
                          <Navigation2 size={20} />
                        </>
                      )}
                    </motion.button>
                  )}

                  <AnimatePresence>
                    {showOtpBox && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='space-y-4 bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100'
                      >
                        <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-widest text-[10px] justify-center mb-2">
                          <ShieldCheck size={14} />
                          <span>Customer PIN Verification</span>
                        </div>
                        <input
                          type="text"
                          className='w-full py-5 bg-white border border-zinc-200 rounded-2xl text-center text-2xl font-black tracking-[1em] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all'
                          placeholder='0000'
                          maxLength={4}
                          onChange={(e) => setOtp(e.target.value)}
                          value={otp}
                        />
                        <button
                          className='w-full bg-zinc-900 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95'
                          onClick={verifyOtp}
                        >
                          {verifyOtpLoading ? <Loader size={20} className='animate-spin mx-auto' /> : "Complete Delivery"}
                        </button>
                        {otpError && <div className='text-red-500 text-xs font-bold text-center'>{otpError}</div>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {activeOrder?.order?.deliveryOtpVerification && (
                    <div className='p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-center flex flex-col items-center gap-3'>
                      <CheckCircle2 size={48} className="text-emerald-500" />
                      <span className='text-emerald-700 font-black uppercase tracking-widest text-xs'>Success Verification</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-zinc-50 pt-[120px] pb-20'>
      <div className="w-[95%] md:w-[85%] mx-auto space-y-10">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-[0.2em] text-[10px] justify-center md:justify-start">
            <Package size={14} />
            <span>Broadcast Queue</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-black text-zinc-900 tracking-tight'>Mission Assignments</h1>
          <p className="text-zinc-500 font-medium">Accept assignments quickly. High demand detected in your area.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(assignments) && assignments.map((a, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className='bg-white p-8 rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 flex flex-col justify-between relative overflow-hidden group'
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                <Truck size={64} />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Assignment ID</div>
                  <div className="text-xl font-black text-zinc-900">#{a?.order?._id?.toString()?.slice(-6).toUpperCase() || 'N/A'}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                    <MapPin size={14} />
                    <span>Drop Point</span>
                  </div>
                  <p className='text-zinc-600 text-sm font-medium line-clamp-2'>{a?.order?.address?.fullAddress}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-zinc-50'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/10'
                  onClick={() => handleAccept(a._id)}
                >
                  Accept
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-white border border-red-100 text-red-500 font-black py-4 rounded-2xl'
                  onClick={() => handleReject(a._id)}
                >
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-zinc-200 shadow-inner">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <RefreshCcw className="text-zinc-300 animate-spin-slow" size={40} />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2">No missions broadcasted</h3>
            <p className="text-zinc-500">Wait for a few moments or move to a busier high-demand zone.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

export default DeliveryBoyDashboard


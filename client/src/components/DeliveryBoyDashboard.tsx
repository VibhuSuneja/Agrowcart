'use client'
import { useSocket } from '@/context/SocketContext'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false })
import DeliveryChat from './DeliveryChat'
import { motion, AnimatePresence } from 'motion/react'
import { Loader, Truck, Navigation2, CheckCircle2, MessageSquare, IndianRupee, MapPin, Package, RefreshCcw, Bell, X, ShieldCheck, Phone, PhoneIncoming, Activity } from 'lucide-react'
import VoiceCall from './VoiceCall'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import toast from 'react-hot-toast'

import TutorialGuide from './TutorialGuide'

interface ILocation {
  latitude: number,
  longitude: number
}

const DELIVERY_TOUR_STEPS = [
  {
    targetId: 'delivery-header',
    title: 'Mission Control',
    content: 'Welcome to your Logistics Hub. Track your daily earnings and active mission status here.'
  },
  {
    targetId: 'delivery-stats',
    title: 'Performace Analytics',
    content: 'Monitor your completed deliveries and total revenue for the current shift.'
  },
  {
    targetId: 'delivery-actions',
    title: 'Status Controls',
    content: 'Go online to start receiving orders or refresh to check for new broadcasts in your vicinity.'
  },
  {
    targetId: 'delivery-queue',
    title: 'Assignment Broadcasts',
    content: 'New delivery missions appear here. Accept them quickly before other agents claim them.'
  }
]

function DeliveryBoyDashboard({ earning }: { earning: number }) {
  const { socket } = useSocket()
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
  const [realTimeEarning, setRealTimeEarning] = useState(earning)
  const [isMissionSuccess, setIsMissionSuccess] = useState(false)

  // Call State
  const [isCalling, setIsCalling] = useState(false)
  const [receivingCall, setReceivingCall] = useState(false)
  const [incomingSignal, setIncomingSignal] = useState<any>(null)
  const [callRoomId, setCallRoomId] = useState("")
  const [callerId, setCallerId] = useState("")

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/delivery/stats')
      setRealTimeEarning(res.data.earnings)
    } catch (error) {
      console.error("Failed to fetch delivery stats", error)
    }
  }

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments")
      setAssignments(result.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!socket || !userData?._id) return
    if (!navigator.geolocation) return
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setDeliveryBoyLocation({ latitude: lat, longitude: lon })
      socket.emit("update-location", { userId: userData?._id, latitude: lat, longitude: lon })
    }, (err) => console.error(err), { enableHighAccuracy: true })
    return () => navigator.geolocation.clearWatch(watcher)
  }, [userData?._id, socket])

  // Pre-load notification audio on first user interaction (bypasses mobile autoplay policy)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const audioUnlockedRef = React.useRef(false)

  useEffect(() => {
    const unlockAudio = () => {
      if (audioUnlockedRef.current) return
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
        audio.volume = 0.01
        audio.play().then(() => {
          audio.pause()
          audio.currentTime = 0
          audio.volume = 0.6
          audioRef.current = audio
          audioUnlockedRef.current = true
          console.log('🔊 Audio unlocked for notifications')
        }).catch(() => { })
      } catch (e) { }
    }
    document.addEventListener('click', unlockAudio, { once: true })
    document.addEventListener('touchstart', unlockAudio, { once: true })
    return () => {
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
    }
  }, [])

  useEffect((): any => {
    if (!socket) return

    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment])
      toast.success("New Delivery Assignment!")

      // Play notification sound (use pre-loaded audio if available)
      try {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(e => console.error("Audio play failed", e))
        } else {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3")
          audio.volume = 0.6
          audio.play().catch(e => console.error("Audio play failed", e))
        }
      } catch (err) {
        console.error("Notification sound failed", err)
      }

      // Vibrate on mobile as fallback
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200])
        }
      } catch (e) { }

      // TTS
      try {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("New delivery mission available");
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.error("TTS failed", err)
      }
    })
    socket.on("order-status-update", ({ orderId, status }) => {
      if (status === "cancelled") {
        toast.error(`Order #${orderId?.toString().slice(-6).toUpperCase()} has been cancelled`)
        fetchCurrentOrder()
        fetchAssignments()
        fetchStats()
      }
      if (status === "delivered") {
        // Order was marked delivered (e.g. by OTP verify), refresh active order
        toast.success(`Order #${orderId?.toString().slice(-6).toUpperCase()} delivered!`)
        fetchCurrentOrder()
        fetchStats()
      }
    })

    socket.on("incoming-call-alert", (data: any) => {
      setReceivingCall(true)
      setIncomingSignal(data.signal)
      setCallRoomId(data.roomId)
      setCallerId(data.from)
    })

    return () => {
      socket.off("new-assignment")
      socket.off("order-status-update")
      socket.off("incoming-call-alert")
    }
  }, [socket])

  const handleAccept = async (id: string) => {
    try {
      await axios.post(`/api/delivery/assignment/${id}/accept-assignment`)
      toast.success("Assignment Accepted!")
      // Refresh both to seamlessly transition
      await fetchCurrentOrder()
      await fetchAssignments()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to accept assignment"
      toast.error(errorMessage)
      // If expired or already taken, refresh assignments list
      if (errorMessage.includes("expired") || errorMessage.includes("already")) {
        await fetchAssignments()
      }
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
      } else {
        // Explicitly clear order if none is active
        setActiveOrder(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCurrentOrder()
    fetchAssignments()
    fetchStats()
  }, [userData])

  const sendOtp = async () => {
    const orderId = activeOrder?.order?._id

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

      // Instead of clearing everything, show success state to allow post-delivery chat
      setIsMissionSuccess(true)

      // Small delay to ensure backend has fully updated
      setTimeout(async () => {
        await fetchStats()
      }, 1000)

    } catch (error) {
      setOtpError("Incorrect OTP provided")
      toast.error("Verification failed")
    } finally {
      setVerifyOtpLoading(false)
    }
  }

  const finishMission = async () => {
    // Clear ALL state to remove the active delivery screen
    setActiveOrder(null)
    setAssignments([])
    setShowOtpBox(false)
    setOtp("")
    setOtpError("")
    setUserLocation({ latitude: 0, longitude: 0 })
    setIsMissionSuccess(false)

    // Re-fetch to ensure sync with backend
    await fetchCurrentOrder()
    await fetchAssignments()
    await fetchStats()
  }

  const handleCallEnd = () => {
    setIsCalling(false)
    setIncomingSignal(null)
    setReceivingCall(false)
  }

  const answerCall = () => {
    setReceivingCall(false)
    setIsCalling(true)
  }

  if (!activeOrder && assignments.length === 0) {
    const analytics = [{ name: "Today", earnings: realTimeEarning, deliveries: Math.round(realTimeEarning / 40) }]
    return (
      <div className='min-h-screen bg-zinc-50 pt-[120px] pb-20'>
        <TutorialGuide steps={DELIVERY_TOUR_STEPS} tourName="delivery_v1" />
        <div className='w-[95%] md:w-[85%] mx-auto max-w-lg'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100 text-center space-y-8"
          >
            <div id="delivery-header" className="space-y-2">
              <div className="w-24 h-24 bg-linear-to-br from-green-500 to-emerald-700 rounded-3xl shadow-xl shadow-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Truck className="text-white" size={48} />
              </div>
              <h2 className='text-3xl font-black text-zinc-900 tracking-tight'>Scanning for Orders</h2>
              <p className='text-zinc-500 font-medium'>You are currently online. Stay nearby to grab high-value deliveries.</p>
            </div>

            <div id="delivery-stats" className='bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 space-y-6'>
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
                  <div className="text-xl font-black text-zinc-900">₹{realTimeEarning}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-zinc-400">Deliveries</div>
                  <div className="text-xl font-black text-green-600">{Math.round(realTimeEarning / 40)}</div>
                </div>
              </div>
            </div>

            <div id="delivery-actions" className="grid grid-cols-2 gap-4">
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
                  <span className="text-[10px] uppercase tracking-widest leading-none text-zinc-900">Go Online</span>
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
        <AnimatePresence>
          {receivingCall && !isCalling && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-80 bg-zinc-900 text-white p-4 rounded-3xl shadow-2xl z-[10000] flex items-center justify-between border border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-full animate-bounce">
                  <PhoneIncoming size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Incoming Call</h4>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Customer Support</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setReceivingCall(false)} className="p-2 bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                  <X size={18} />
                </button>
                <button onClick={answerCall} className="p-2 bg-green-500 rounded-xl hover:bg-green-600 transition-colors">
                  <Phone size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {isCalling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm h-[500px] bg-zinc-900 rounded-[3rem] overflow-hidden shadow-3xl">
                <VoiceCall
                  roomId={callRoomId}
                  userId={userData?._id?.toString()!}
                  otherUserId={callerId}
                  isInitiator={!incomingSignal}
                  incomingSignal={incomingSignal}
                  onEnd={handleCallEnd}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <TutorialGuide steps={DELIVERY_TOUR_STEPS} tourName="delivery_v1" />
        <div className='w-[95%] md:w-[85%] mx-auto max-w-4xl space-y-8'>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className={`flex items-center gap-2 ${isMissionSuccess ? 'text-green-600' : 'text-blue-600'} font-bold uppercase tracking-[0.2em] text-[10px]`}>
                <Activity size={14} className={isMissionSuccess ? "" : "animate-pulse"} />
                <span>{isMissionSuccess ? "Mission Accomplished" : "Active Delivery Protocol"}</span>
              </div>
              <h1 className='text-4xl font-black text-zinc-900 tracking-tight'>{isMissionSuccess ? "Mission Success" : "Live Mission"}</h1>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-3">
              <div className={`w-2 h-2 ${isMissionSuccess ? 'bg-zinc-300' : 'bg-green-500 animate-ping'} rounded-full`} />
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                      <MapPin size={16} />
                      <span>Drop-off Point</span>
                    </div>
                    {activeOrder?.order?.user && (
                      <button
                        onClick={() => {
                          setCallRoomId(`call:${activeOrder.order._id}`)
                          setCallerId(activeOrder.order.user) // Reusing callerId for destination
                          setIsCalling(true)
                          // initiator true if signal is null
                          setIncomingSignal(null)
                        }}
                        className="p-3 bg-zinc-900 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform flex items-center gap-2"
                      >
                        <Phone size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                      </button>
                    )}
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
                          className='w-full py-5 bg-white border border-zinc-200 rounded-2xl text-center text-2xl font-black tracking-[1em] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-zinc-900'
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

                  {(activeOrder?.order?.deliveryOtpVerification || isMissionSuccess) && (
                    <div className='space-y-4'>
                      <div className='p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-center flex flex-col items-center gap-3'>
                        <CheckCircle2 size={48} className="text-emerald-500" />
                        <span className='text-emerald-700 font-black uppercase tracking-widest text-xs'>Delivery Verified</span>
                      </div>
                      <button
                        onClick={finishMission}
                        className='w-full py-5 bg-zinc-900 text-white font-black rounded-2xl shadow-xl'
                      >
                        Finish & Return
                      </button>
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
      <TutorialGuide steps={DELIVERY_TOUR_STEPS} tourName="delivery_v1" />
      <div className="w-[95%] md:w-[85%] mx-auto space-y-10">
        <div id="delivery-header" className="space-y-1 text-center md:text-left">
          <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-[0.2em] text-[10px] justify-center md:justify-start">
            <Package size={14} />
            <span>Broadcast Queue</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-black text-zinc-900 tracking-tight'>Mission Assignments</h1>
          <p className="text-zinc-500 font-medium">Accept assignments quickly. High demand detected in your area.</p>
        </div>

        <div id="delivery-queue" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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


export default DeliveryBoyDashboard


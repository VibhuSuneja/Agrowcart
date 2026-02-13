'use client'
import dynamic from 'next/dynamic'
const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false })
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft, Loader, Send, Sparkle, Smile } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import Nav from "@/components/Nav"
import VoiceCall from '@/components/VoiceCall'
import { Phone, PhoneIncoming, X } from 'lucide-react'
import { useSocket } from '@/context/SocketContext'

import { useParams, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { IMessage } from '@/models/message.model'
interface IOrder {
  _id?: string
  user: string
  items: [
    {
      grocery: string,
      name: string,
      price: string,
      unit: string,
      image: string
      quantity: number
    }
  ]
  ,
  isPaid: boolean
  totalAmount: number,
  paymentMethod: "cod" | "online"
  address: {
    fullName: string,
    mobile: string,
    city: string,
    state: string,
    pincode: string,
    fullAddress: string,
    latitude: number,
    longitude: number
  }
  assignment?: string
  assignedDeliveryBoy?: IUser
  status: "pending" | "out of delivery" | "delivered",
  createdAt?: Date
  updatedAt?: Date
  deliveryOtp?: string
}

interface ILocation {
  latitude: number,
  longitude: number
}
function TrackOrder({ params }: { params: { orderId: string } }) {
  const { userData } = useSelector((state: RootState) => state.user)
  const { orderId } = useParams()
  const [order, setOrder] = useState<IOrder>()
  const router = useRouter()
  const [newMessage, setNewMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [messages, setMessages] = useState<IMessage[]>()
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [userLocation, setUserLocation] = useState<ILocation>(
    {
      latitude: 0,
      longitude: 0
    }
  )
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0
  })

  // Call State
  const { socket } = useSocket()
  const [isCalling, setIsCalling] = useState(false)
  const [receivingCall, setReceivingCall] = useState(false)
  const [incomingSignal, setIncomingSignal] = useState<any>(null)
  const [callRoomId, setCallRoomId] = useState("")
  const [otherPartyId, setOtherPartyId] = useState("")

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`)
        setOrder(result.data)
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude
        })
        setDeliveryBoyLocation({
          latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
          longitude: result.data.assignedDeliveryBoy.location.coordinates[0]
        })
      } catch (error) {
        console.log(error)
      }
    }
    getOrder()
  }, [userData?._id])

  useEffect(() => {
    const socket = getSocket()

    // Listen for Delivery Boy Location
    socket.on("update-deliveryBoy-location", (data) => {
      console.log("Delivery Boy Location Update:", data)
      setDeliveryBoyLocation({
        latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.longitude,
      })
    })

    // Listen for Order Assignment (Fix for bug: assignment not showing)
    socket.on("order-assigned", (data) => {
      console.log("Order Assigned Socket Event:", data)
      if (data.orderId === orderId) {
        setOrder((prev) => prev ? { ...prev, status: "out of delivery", assignedDeliveryBoy: data.assignedDeliveryBoy, deliveryOtp: data.deliveryOtp } : prev)

        // Also update initial location
        if (data.assignedDeliveryBoy?.location?.coordinates) {
          setDeliveryBoyLocation({
            latitude: data.assignedDeliveryBoy.location.coordinates[1],
            longitude: data.assignedDeliveryBoy.location.coordinates[0]
          })
        }
      }
    })

    // Listen for Order Status Updates (Fix for bug: delivery not showing)
    socket.on("order-status-updated", (data) => {
      console.log("Order Status Update Socket Event:", data)
      if (data.orderId === orderId) {
        setOrder((prev) => prev ? { ...prev, status: data.status } : prev)
      }
    })

    socket.on("incoming-call-alert", (data: any) => {
      if (data.roomId === orderId || data.roomId === `call:${orderId}`) {
        setReceivingCall(true)
        setIncomingSignal(data.signal)
        setCallRoomId(data.roomId)
        setOtherPartyId(data.from)
      }
    })

    return () => {
      socket.off("update-deliveryBoy-location")
      socket.off("order-assigned")
      socket.off("order-status-updated")
      socket.off("incoming-call-alert")
    }
  }, [orderId, order])

  useEffect(() => {
    if (!orderId) return
    const socket = getSocket()
    socket.emit("join-room", orderId)
    socket.on("send-message", (message) => {
      if (message.roomId === orderId) {
        setMessages((prev) => [...(prev || []), message])
      }
    })

    return () => {
      socket.off("send-message")
    }
  }, [orderId])

  const startCall = () => {
    if (!order?.assignedDeliveryBoy?._id) return
    setCallRoomId(`call:${orderId}`)
    setOtherPartyId(order.assignedDeliveryBoy._id.toString())
    setIsCalling(true)
  }

  const handleCallEnd = () => {
    setIsCalling(false)
    setReceivingCall(false)
    setIncomingSignal(null)
  }

  const answerCall = () => {
    setReceivingCall(false)
    setIsCalling(true)
  }

  const sendMsg = () => {
    const socket = getSocket()

    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: userData?._id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }
    socket.emit("send-message", message)

    setNewMessage("")
  }
  useEffect(() => {
    const getAllMessages = async () => {
      if (!orderId) return
      try {
        const result = await axios.post("/api/chat/messages", { roomId: orderId })
        setMessages(result.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllMessages()
  }, [orderId])

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [messages])

  const getSuggestion = async () => {
    setLoading(true)
    try {
      // Try to find the last message from the delivery boy
      let lastMessage = messages?.filter(m => m.senderId.toString() !== userData?._id)?.at(-1)

      // If no message from delivery boy, use the last message from anyone (for context)
      if (!lastMessage && messages && messages.length > 0) {
        lastMessage = messages.at(-1)
      }

      // If still no messages, messageText will be empty, and the API will generate starters
      const messageText = lastMessage?.text || ""

      const result = await axios.post("/api/chat/ai-suggestions", {
        message: messageText,
        role: "user"
      })

      if (Array.isArray(result.data) && result.data.length > 0) {
        setSuggestions(result.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-zinc-50 dark:bg-zinc-950'>
      <Nav user={userData as any} />
      <div className='max-w-2xl mx-auto pb-24 pt-24'>
        <div className='sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 border-b border-zinc-100 dark:border-zinc-800 shadow flex gap-3 items-center z-50'>
          <button className='p-2 bg-green-100 dark:bg-zinc-800 rounded-full' onClick={() => router.push('/user/my-orders')}><ArrowLeft className="text-green-700 dark:text-green-400" size={20} /></button>
          <div>
            <h2 className='text-xl font-black text-zinc-900 dark:text-zinc-100'>Track Order</h2>
            <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>order#{order?._id?.toString().slice(-6)} <span className='text-green-700 dark:text-green-500 font-black ml-2'>{order?.status}</span></p>
          </div>
          <div className="ml-auto flex gap-2">
            {order?.assignedDeliveryBoy && order?.status !== 'delivered' && (
              <button
                onClick={startCall}
                className="p-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full shadow-lg hover:scale-110 transition-transform"
                title="Call Delivery Partner"
              >
                <Phone size={20} />
              </button>
            )}
            {order?.status === 'delivered' && (
              <div className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-200 dark:border-green-500/30">
                Fulfilled
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {receivingCall && !isCalling && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[200] bg-zinc-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-zinc-700 mx-auto"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-full animate-bounce">
                  <PhoneIncoming size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Delivery Partner Calling</h4>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Live Audio Link</p>
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
              className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm h-[500px] bg-zinc-900 rounded-[3rem] overflow-hidden shadow-3xl">
                <VoiceCall
                  roomId={callRoomId}
                  userId={userData?._id?.toString()!}
                  otherUserId={otherPartyId}
                  isInitiator={!incomingSignal}
                  incomingSignal={incomingSignal}
                  onEnd={handleCallEnd}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className='px-4 mt-6 space-y-4'>
          <div className='rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 p-1'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}>
              {order?.status === "out of delivery" && order?.deliveryOtp && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className='bg-green-50 dark:bg-green-500/10 rounded-2xl p-3 border border-green-100 dark:border-green-500/20 flex items-center gap-4 shadow-sm'
                >
                  <div className="bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl shadow-xs border border-green-100 dark:border-green-500/20 text-center">
                    <span className='text-[9px] font-bold uppercase text-zinc-400 block leading-none mb-1'>PIN</span>
                    <span className='text-lg font-black text-green-600 dark:text-green-400 tracking-[0.2em] leading-none'>{order.deliveryOtp}</span>
                  </div>
                  <div className='hidden sm:block'>
                    <p className='text-xs text-green-800 dark:text-green-300 font-bold'>D-OTP Active</p>
                    <p className='text-[10px] text-green-600 dark:text-green-500 leading-tight'>Share with partner only during handover.</p>
                  </div>
                </motion.div>
              )}
            </LiveMap>
          </div>

          <div className='bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 h-[480px] flex flex-col'>

            <div className='flex justify-between items-center mb-4'>
              <span className='font-black text-zinc-400 text-[10px] uppercase tracking-[0.2em]'>Quick Replies</span>
              <motion.button
                disabled={loading}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-full shadow-sm border border-purple-200 dark:border-purple-500/20 cursor-pointer"
                onClick={getSuggestion}
              ><Sparkle size={14} />{loading ? <Loader className="w-5 h-5 animate-spin" /> : "AI suggest"}</motion.button>
            </div>

            <div className='flex gap-2 flex-wrap mb-4'>
              {suggestions.map((s, i) => (
                <motion.div
                  key={s}
                  whileTap={{ scale: 0.92 }}
                  className="px-4 py-2 text-[10px] font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 cursor-pointer text-zinc-600 dark:text-zinc-400 rounded-full hover:border-green-400 transition-all"
                  onClick={() => setNewMessage(s)}
                >
                  {s}
                </motion.div>
              ))}
            </div>

            <div className='flex-1 overflow-y-auto p-2 space-y-4 mb-4 scrollbar-hide' ref={chatBoxRef}>
              <AnimatePresence>
                {messages?.map((msg, index) => (
                  <motion.div
                    key={msg._id?.toString() || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.senderId.toString() == userData?._id ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`px-5 py-3 max-w-[80%] rounded-2xl shadow-xl 
                  ${msg.senderId.toString() === userData?._id
                        ? "bg-zinc-900 text-white rounded-br-none"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-bl-none"
                      }`}>
                      <p className="text-sm font-medium">{msg.text}</p>
                      <p className='text-[9px] font-bold opacity-40 mt-1 text-right uppercase tracking-widest'>{msg.time}</p>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>


            <div className='flex gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 relative'>
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-0 z-50">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => setNewMessage(prev => prev + emojiData.emoji)}
                    lazyLoadEmojis={true}
                    theme={userData ? 'dark' : 'light'}
                  />
                </div>
              )}
              <button
                className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={20} />
              </button>
              <input
                type="text"
                placeholder={order?.status === 'delivered' ? 'Mission Completed - Chat Closed' : 'Type a Message...'}
                className={`flex-1 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800 px-5 py-3 rounded-2xl outline-none transition-all text-sm font-medium ${order?.status === 'delivered' ? 'cursor-not-allowed opacity-50' : 'focus:ring-2 focus:ring-green-400'}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
                disabled={order?.status === 'delivered'}
              />
              <button
                disabled={order?.status === 'delivered' || !newMessage.trim()}
                className={`p-4 rounded-2xl transition-all ${order?.status === 'delivered' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed' : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'}`}
                onClick={sendMsg}
              >
                <Send size={20} />
              </button>
            </div>

          </div>




        </div>
      </div>
    </div>
  )
}

export default TrackOrder

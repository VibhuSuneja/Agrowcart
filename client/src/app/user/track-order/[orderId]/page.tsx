'use client'
import dynamic from 'next/dynamic'
const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false })
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft, Loader, Send, Sparkle } from 'lucide-react'
import Nav from "@/components/Nav"

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

    return () => {
      socket.off("update-deliveryBoy-location")
      socket.off("order-assigned")
      socket.off("order-status-updated")
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

      // If still no messages, use a generic prompt
      const messageText = lastMessage?.text || "Hello, I'm tracking my order"

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
    <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white'>
      <Nav user={userData as any} />
      <div className='max-w-2xl mx-auto pb-24 pt-24'>
        <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999'>
          <button className='p-2 bg-green-100 rounded-full' onClick={() => router.back()}><ArrowLeft className="text-green-700" size={20} /></button>
          <div>
            <h2 className='text-xl font-bold'>Track Order</h2>
            <p className='text-sm text-gray-600'>order#{order?._id?.toString().slice(-6)} <span className='text-green-700 font-semibold'>{order?.status}</span></p>
          </div>

        </div>
        <div className='px-4 mt-6 space-y-4'>
          <div className='rounded-3xl overflow-hidden border shadow bg-white p-1'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}>
              {order?.status === "out of delivery" && order?.deliveryOtp && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className='bg-green-50 rounded-2xl p-3 border border-green-100 flex items-center gap-4 shadow-sm'
                >
                  <div className="bg-white px-3 py-2 rounded-xl shadow-xs border border-green-100 text-center">
                    <span className='text-[9px] font-bold uppercase text-zinc-400 block leading-none mb-1'>PIN</span>
                    <span className='text-lg font-black text-green-600 tracking-[0.2em] leading-none'>{order.deliveryOtp}</span>
                  </div>
                  <div className='hidden sm:block'>
                    <p className='text-xs text-green-800 font-bold'>D-OTP Active</p>
                    <p className='text-[10px] text-green-600 leading-tight'>Share with partner only during handover.</p>
                  </div>
                </motion.div>
              )}
            </LiveMap>
          </div>

          <div className='bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col'>

            <div className='flex justify-between items-center mb-3'>
              <span className='font-semibold text-gray-700 text-sm'>Quick Replies</span>
              <motion.button
                disabled={loading}
                whileTap={{ scale: 0.9 }}
                className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer"
                onClick={getSuggestion}
              ><Sparkle size={14} />{loading ? <Loader className="w-5 h-5 animate-spin" /> : "AI suggest"}</motion.button>
            </div>

            <div className='flex gap-2 flex-wrap mb-3'>
              {suggestions.map((s, i) => (
                <motion.div
                  key={s}
                  whileTap={{ scale: 0.92 }}
                  className="px-3 py-1 text-xs bg-green-50 border border-green-200 cursor-pointer text-green-700 rounded-full"
                  onClick={() => setNewMessage(s)}
                >
                  {s}
                </motion.div>
              ))}
            </div>

            <div className='flex-1 overflow-y-auto p-2 space-y-3' ref={chatBoxRef}>
              <AnimatePresence>
                {messages?.map((msg, index) => (
                  <motion.div
                    key={msg._id?.toString()}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.senderId.toString() == userData?._id ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                  ${msg.senderId.toString() === userData?._id
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}>
                      <p >{msg.text}</p>
                      <p className='text-[10px] opacity-70 mt-1 text-right'>{msg.time}</p>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>


            <div className='flex gap-2 mt-3 border-t pt-3'>
              <input type="text" placeholder='Type a Message...' className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <button className='bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white' onClick={sendMsg}><Send size={18} /></button>
            </div>

          </div>




        </div>
      </div>
    </div>
  )
}

export default TrackOrder

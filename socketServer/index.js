import express from "express"
import http from "http"
import dotenv from "dotenv"
import { Server } from "socket.io"
import axios from "axios"

dotenv.config()
const app=express()
app.use(express.json())
const server=http.createServer(app)
const port=process.env.PORT || 5000

const io=new Server(server,{
    cors:{
        origin:process.env.NEXT_BASE_URL
    }
})

io.on("connection",(socket)=>{

   socket.on("identity",async (userId)=>{
    try {
        await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`,{userId,socketId:socket.id}, {
            headers: { 'x-internal-secret': 'my-secure-interal-secret' }
        })
    } catch (error) {
        console.error("Error in identity:", error.message)
    }
   }) 

   socket.on("update-location",async ({userId,latitude,longitude})=>{
    try {
        const location={
            type:"Point",
            coordinates:[longitude,latitude]
        }
        await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`,{userId,location}, {
            headers: { 'x-internal-secret': 'my-secure-interal-secret' }
        })
        io.emit("update-deliveryBoy-location",{userId,location})
    } catch (error) {
        console.error("Error updating location:", error.message)
    }
   })

   socket.on("join-room",(roomId)=>{
    console.log("join room with",roomId)
    socket.join(roomId)
   })

  socket.on("send-message",async (message)=>{
    try {
        console.log(message)
        await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`,message, {
            headers: { 'x-internal-secret': 'my-secure-interal-secret' }
        })
        io.to(message.roomId).emit("send-message",message)
    } catch (error) {
        console.error("Error sending message:", error.message)
    }
  })

  // WebRTC Signaling
  socket.on("call-user", ({ userToCall, signalData, from, roomId }) => {
      // Broadcast to everyone else in the room (which should just be the other person)
      socket.to(roomId).emit("call-received", { signal: signalData, from })
  })

  socket.on("answer-call", ({ signal, to, roomId }) => {
      socket.to(roomId).emit("call-accepted", signal)
  })

  socket.on("end-call", ({ roomId }) => {
      socket.to(roomId).emit("end-call")
  })
  
    socket.on("disconnect",()=>{
console.log("user disconnected",socket.id)
    })

})


app.post("/notify",(req,res)=>{
    const {event,data,socketId}=req.body
    if(socketId){
        io.to(socketId).emit(event,data)
    }else{
        io.emit(event,data)
    }

    return res.status(200).json({"success":true})
})



server.listen(port,()=>{
    console.log("server started at",port)
})
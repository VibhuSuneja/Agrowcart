import express from "express";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const server = http.createServer(app);

// Use Port 4000 to match NEXT_PUBLIC_SOCKET_SERVER in .env and Client configuration
const PORT = process.env.PORT || 4000;
const NEXT_BASE_URL = process.env.NEXT_BASE_URL || "http://localhost:3000";

const io = new Server(server, {
    cors: {
        origin: "*", // Flexible for dev, can be NEXT_BASE_URL for prod
        methods: ["GET", "POST"]
    }
});

// Expert State Management for Presence
const onlineUsers = new Map(); // userId -> Set(socketIds)

console.log(`🚀 AgrowCart Real-time Sync Server Active [Port ${PORT}]`);

io.on("connection", (socket) => {
    let currentUserId = null;
    console.log(`📡 Node Connected: ${socket.id}`);

    // IDENTITY: Links Socket ID with Database User
    socket.on("identity", async (userId) => {
        try {
            console.log(`👤 Identity established for: ${userId}`);
            currentUserId = String(userId);
            
            // Track online state
            if (!onlineUsers.has(currentUserId)) onlineUsers.set(currentUserId, new Set());
            onlineUsers.get(currentUserId).add(socket.id);

            // Join personal user room for global alerts
            socket.join(`user:${currentUserId}`);

            // Notify others
            io.emit("user-status-change", { userId: currentUserId, status: "online" });

            // Sync with Next.js internal API (Correct Logic Pattern)
            await axios.post(`${NEXT_BASE_URL}/api/socket/connect`, { userId, socketId: socket.id }, {
                headers: { 'x-internal-secret': 'my-secure-interal-secret' }
            }).catch(e => console.log("DB Context: Connection logged (fallback)"));

        } catch (error) {
            console.error("Error in identity:", error.message);
        }
    });

    // ROOMS
    socket.on("join-room", (roomId) => {
        if (!roomId) return;
        socket.join(roomId);
        console.log(`✅ [Room] ${socket.id} joined ${roomId}`);
    });

    // LOCATION UPDATES (Merged from previous index.js)
    socket.on("update-location", async ({ userId, latitude, longitude }) => {
        try {
            const location = {
                type: "Point",
                coordinates: [longitude, latitude]
            };
            // Sync location to DB
            await axios.post(`${NEXT_BASE_URL}/api/socket/update-location`, { userId, location }, {
                headers: { 'x-internal-secret': 'my-secure-interal-secret' }
            }).catch(e => console.log("Location DB Sync Error (non-fatal)"));

            // Broadcast to delivery boys or tracking maps
            io.emit("update-deliveryBoy-location", { userId, location });
        } catch (error) {
            console.error("Error updating location:", error.message);
        }
    });

    // MESSAGING (Correct Logic Pattern)
    socket.on("send-message", async (message) => {
        try {
            if (!message || !message.roomId) return;
            console.log(`💬 [Message] [${message.roomId}] Sent by ${message.senderId}`);

            // 1. Relay to everyone in the room IMMEDIATELY
            io.to(message.roomId).emit("send-message", message);

            // 2. Global Notification (for recipients NOT in the room)
            const parts = message.roomId.split(':');
            if (parts.length >= 3) {
                const farmerId = parts[1];
                const buyerId = parts[2];
                const recipientId = (String(message.senderId) === String(farmerId)) ? buyerId : farmerId;
                
                io.to(`user:${recipientId}`).emit("new-message-notification", {
                    roomId: message.roomId,
                    text: message.text,
                    senderId: message.senderId,
                    time: message.time,
                    senderName: message.senderName || "Partner"
                });
            }

            // 3. Persist to Database (Reliable Storage)
            await axios.post(`${NEXT_BASE_URL}/api/chat/save`, message, {
                headers: { 'x-internal-secret': 'my-secure-interal-secret' }
            }).catch(e => {
                // Try fallback send route if 'save' fails
                axios.post(`${NEXT_BASE_URL}/api/chat/send`, message).catch(err => console.error("Message backup failed"));
            });

        } catch (error) {
            console.error("Error sending message:", error.message);
        }
    });

    // WebRTC SIGNALING (Precision Bridging)
    socket.on("call-user", (data) => {
        if (!data.roomId || !data.userToCall) return;
        console.log(`📞 [Call-Offer] from ${data.from} to ${data.userToCall}`);
        
        // Target room signaling
        socket.to(data.roomId).emit("call-received", { 
            signal: data.signalData, 
            from: data.from,
            roomId: data.roomId 
        });

        // Global alert for user on dashboard
        io.to(`user:${data.userToCall}`).emit("incoming-call-alert", {
            signal: data.signalData,
            from: data.from,
            roomId: data.roomId
        });
    });

    socket.on("answer-call", (data) => {
        if (!data.roomId) return; // 'data.to' might be undefined in some flows, relying on roomId
        console.log(`⚡ [Binary-Answer] Handshake across ${data.roomId}`);
        socket.to(data.roomId).emit("call-accepted", data.signal);
    });

    socket.on("end-call", (data) => {
        if (!data.roomId) return;
        console.log(`❌ [End] Audio link severed in ${data.roomId}`);
        io.to(data.roomId).emit("end-call");
    });

    // PRESENCE & TYPING
    socket.on("check-user-status", (userId, callback) => {
        const isOnline = onlineUsers.has(String(userId)) && onlineUsers.get(String(userId)).size > 0;
        callback({ status: isOnline ? "online" : "offline" });
    });

    socket.on("typing", (data) => {
        socket.to(data.roomId).emit("typing", data);
    });

    socket.on("stop-typing", (data) => {
        socket.to(data.roomId).emit("stop-typing", data);
    });

    // DISCONNECT
    socket.on("disconnect", (reason) => {
        console.log(`🥀 Node Disconnected: ${socket.id} (${reason})`);
        if (currentUserId && onlineUsers.has(currentUserId)) {
            onlineUsers.get(currentUserId).delete(socket.id);
            if (onlineUsers.get(currentUserId).size === 0) {
                onlineUsers.delete(currentUserId);
                io.emit("user-status-change", { userId: currentUserId, status: "offline" });
            }
        }
    });
});

// Notify endpoint for Next.js to push events (Dynamic Updates)
app.post("/notify", (req, res) => {
    const { event, data, socketId } = req.body;
    if (socketId) {
        io.to(socketId).emit(event, data);
    } else {
        io.emit(event, data);
    }
    return res.status(200).json({ "success": true });
});

server.listen(PORT, () => {
    console.log(`✅ Socket server running on port ${PORT}`);
});
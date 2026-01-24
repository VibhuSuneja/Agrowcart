const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log("Socket.IO server running on port 3001");

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send-message", (message) => {
    console.log("Message received:", message);
    // Broadcast to everyone in the room EXCEPT the sender (optional, but UI handles optimistic update)
    // Actually, usually we broadcast to everyone so they know it was received, 
    // BUT since we have optimistic UI, we might want to broadcast to `socket.to(room)` 
    // or just emit to the room. 
    // Let's emit to the room so listeners get it.
    // NOTE: The client code `setMessages` has a duplicate check, so it's safe to receive your own message back.
    io.to(message.roomId).emit("send-message", message);
  });

  // Signaling for WebRTC
  socket.on("call-user", (data) => {
    console.log(`Call offer from ${data.from} to room ${data.roomId}`);
    // Broadcast to the room (or specific user if we tracked socketIds map)
    // Since we use rooms for negotiation:
    socket.to(data.roomId).emit("call-received", { signal: data.signalData, from: data.from });
  });

  socket.on("answer-call", (data) => {
    console.log(`Call answered by ${data.from} in room ${data.roomId}`);
    socket.to(data.roomId).emit("call-accepted", data.signal);
  });
  
  socket.on('end-call', (data) => {
      console.log(`Call ended in room ${data.roomId}`);
      socket.to(data.roomId).emit('end-call');
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

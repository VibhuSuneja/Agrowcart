import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = () => {
    if (!socket) {
        let socketUrl = "http://localhost:4000";

        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            socketUrl = `http://${hostname}:4000`;
        }

        console.log("🔌 Attempting Socket Connection to:", socketUrl);

        socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || socketUrl, {
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            transports: ['websocket'], // Force WebSocket to avoid polling desync
            forceNew: false
        });

        socket.on("connect", () => {
            console.log("🟢 Socket Connected Successfully! ID:", socket?.id);
        });

        socket.on("connect_error", (err) => {
            console.error("🔴 Socket Connection Error:", err.message);
        });

        socket.on("disconnect", (reason) => {
            console.warn("🟡 Socket Disconnected:", reason);
        });
    }
    return socket
}
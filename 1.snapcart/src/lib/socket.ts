import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = () => {
    if (!socket) {
        // Force port 3001 where our dedicated server is running
        socket = io("http://localhost:3001")
    }
    return socket
}
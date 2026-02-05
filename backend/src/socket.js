import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", 'https://chatapp-28215.vercel.app','https://chat-app-socket-react.vercel.app/', "https://chatappf.onrender.com"]
    }
})

const onlineUsers = {};

export function getReceiverSocketId(userId) {
    return onlineUsers[userId];
}

io.on("connection", (socket) => {
    console.log("User connected " + socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) onlineUsers[userId] = socket.id;

    io.emit("onlineUsers", Object.keys(onlineUsers))

    socket.on("disconnect", () => {
        console.log("User disconnected " + socket.id);
        delete onlineUsers[userId];
        io.emit("onlineUsers", Object.keys(onlineUsers))
    });

    socket.on("callUser", ({ offer, to, from }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incomingCall", { offer, from });
        }
    })

    socket.on("callAccepted", ({ to, answer }) => {
        io.to(to).emit("callAccepted", { answer, from: socket.id });
    })

    socket.on("peerNegotiation", ({ to, offer }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("peerNegotiation", { offer, from: socket.id });
        }
    })

    socket.on("peerNegotiationDone", ({ to, answer }) => {
        io.to(to).emit("peerNegotiationFinished", { answer });
    });


    socket.on("ice-candidate", ({ to, candidate }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("ice-candidate", {
                candidate,
                from: socket.id,
            });
        }
    });

});



export { io, server, app };

import { Server } from "socket.io";
import http from "http";
import express from "express";
import { log } from "console";

const app = express();
const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté", socket.id);

  console.log(userSocketMap);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté", socket.id);
  });
});

export { io, app, serverHttp };

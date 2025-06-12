import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté", socket.id);

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté", socket.id);
  });
});

export { io, app, serverHttp };

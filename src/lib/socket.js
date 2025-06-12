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

export { io, app, serverHttp };

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Matchmaker } from "./Matchmaker";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import authRoutes from "./auth";
import { initCleanupTask } from "./services/cleanup";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize background tasks
initCleanupTask();


// Auth routes
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Socket.IO Middleware for Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    (socket as any).user = decoded;
    console.log(`[AUTH] Token verified for: ${decoded.username}`);
    next();
  } catch (err) {
    console.warn(`[AUTH] Invalid token from socket ${socket.id}`);
    next(new Error("Authentication error: Invalid token"));
  }
});

const matchmaker = new Matchmaker();

// Periodically broadcast online user count
setInterval(() => {
  io.emit("online-users-count", { count: io.engine.clientsCount });
}, 5000);

  io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  const user = (socket as any).user;
  console.log(`[CONN] ${user.username} connected. Total: ${io.engine.clientsCount}`);
  
  // Update all clients with new count
  io.emit("online-users-count", { count: io.engine.clientsCount });

  // Matchmaking
  socket.on("join-queue", () => {
    console.log(`[QUEUE] User ${user.username} (${socket.id}) requested match`);
    matchmaker.joinQueue(socket);
  });

  socket.on("leave-queue", () => {
    console.log(`[QUEUE] User ${user.username} (${socket.id}) left queue`);
    matchmaker.leaveQueue(socket);
  });

  socket.on("next-user", () => {
      console.log(`[QUEUE] User ${user.username} (${socket.id}) requested next match`);
      matchmaker.handleNext(socket);
      matchmaker.joinQueue(socket);
  })

  // Signalling
  socket.on("send-offer", (payload) => {
    socket.to(payload.roomId).emit("receive-offer", payload);
  });

  socket.on("send-answer", (payload) => {
    socket.to(payload.roomId).emit("receive-answer", payload);
  });

  socket.on("send-ice-candidate", (payload) => {
    socket.to(payload.roomId).emit("receive-ice-candidate", payload);
  });

  // Text chat
  socket.on("send-chat-message", (payload) => {
    socket.to(payload.roomId).emit("receive-chat-message", payload);
  });

  socket.on("disconnect", () => {
    console.log(`[DISCONN] ${user.username} disconnected. Total: ${io.engine.clientsCount}`);
    matchmaker.handleDisconnect(socket);
    // Update all clients with new count
    io.emit("online-users-count", { count: io.engine.clientsCount });
  });
});


const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});

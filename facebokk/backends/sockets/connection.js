import { Server } from "socket.io";

const onlineUsers = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Socket connected:", socket.id);

    // ---------------------------
    // User joins their personal room
    // ---------------------------
    socket.on("join", (userId) => {
      if (!userId) return;

      socket.join(userId); // single-room per user

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, {
          sockets: new Set(),
          lastSeen: null,
        });

        // First time online → notify all
        socket.broadcast.emit("userOnline", { userId });
      }

      onlineUsers.get(userId).sockets.add(socket.id);
    });

    // ---------------------------
    // Handle disconnect
    // ---------------------------
    socket.on("disconnect", () => {
      for (const [userId, data] of onlineUsers.entries()) {
        if (data.sockets.has(socket.id)) {
          data.sockets.delete(socket.id);

          // Grace period before marking offline
          setTimeout(() => {
            // Agar user ke aur sockets na ho → offline
            if (data.sockets.size === 0) {
              onlineUsers.delete(userId);

              io.to(userId).emit("userOffline", {
                userId,
                lastSeen: new Date(), // accurate last seen
              });

              socket.broadcast.emit("userOffline", {
                userId,
                lastSeen: new Date(),
              });
            }
          }, 15000); // 15 sec buffer
        }
      }
    });

    // ---------------------------
    // Optional: Typing indicator
    // ---------------------------
    socket.on("typing", ({ senderId, receiverId, isTyping }) => {
      io.to(receiverId).emit("typing", { senderId, isTyping });
    });

    // ---------------------------
    // Optional: Message read receipts
    // ---------------------------
    socket.on("messageRead", ({ conversationId, readerId }) => {
      io.to(conversationId).emit("messageRead", { conversationId, readerId });
    });
  });

  return io;
};

export default initSocket;

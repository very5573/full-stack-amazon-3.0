import { Server } from "socket.io";
import { initChatSocket } from "./chat.socket.js";
import { initPresenceSocket } from "./presence.socket.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  console.log("⚡ Socket.IO server initialized");

  // -------------------------------
  // Create Namespaces
  // -------------------------------
  const chatNamespace = io.of("/chat");
  const presenceNamespace = io.of("/presence");

  // Initialize socket logic
  initChatSocket(chatNamespace);
  initPresenceSocket(presenceNamespace);

  return io;
};

export default initSocket;

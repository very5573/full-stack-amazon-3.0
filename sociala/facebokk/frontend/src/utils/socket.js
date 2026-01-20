import { io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

// -------------------- CHAT SOCKET --------------------
export const chatSocket = io(`${BACKEND_URL}/chat`, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // connect manually
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
});

// -------------------- PRESENCE SOCKET --------------------
export const presenceSocket = io(`${BACKEND_URL}/presence`, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // connect manually
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
});

// -------------------- HELPERS --------------------
// Connect chat socket
export const connectChatSocket = () => {
  if (!chatSocket.connected && !chatSocket.connecting) chatSocket.connect();
};

// Connect presence socket
export const connectPresenceSocket = () => {
  if (!presenceSocket.connected && !presenceSocket.connecting) presenceSocket.connect();
};

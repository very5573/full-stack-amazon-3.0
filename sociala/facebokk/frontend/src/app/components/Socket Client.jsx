import { io } from "socket.io-client";
import { useEffect, useState } from "react";

let socket;

export const useChatSocket = (userId) => {
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // 1️⃣ Connect to socket server
    socket = io("http://localhost:5000", { // backend URL
      query: { userId },
    });

    console.log("Connected to chat socket");

    // 2️⃣ Listen for new messages
    socket.on("newMessage", ({ message, conversation }) => {
      console.log("📩 New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    // 3️⃣ Listen for new pending request
    socket.on("newRequest", ({ conversation }) => {
      console.log("🔔 New conversation request:", conversation);
      setRequests((prev) => [...prev, conversation]);
    });

    // 4️⃣ Listen for accepted conversation
    socket.on("requestAccepted", ({ conversation, messages }) => {
      console.log("✅ Conversation accepted:", conversation);
      setMessages(messages);
      // update UI accordingly
    });

    // 5️⃣ Listen for rejected conversation
    socket.on("requestRejected", ({ conversation }) => {
      console.log("❌ Conversation rejected:", conversation);
      setRequests((prev) => prev.filter((c) => c._id !== conversation._id));
    });

    // 6️⃣ Cleanup on unmount
    return () => {
      socket.disconnect();
      console.log("⚡ Socket disconnected");
    };
  }, [userId]);

  // 7️⃣ Function to emit messages
  const sendMessage = ({ senderId, receiverId, text, conversationId }) => {
    socket.emit("sendMessage", { senderId, receiverId, text, conversationId });
  };

  const acceptConversation = (conversationId) => {
    socket.emit("acceptConversation", conversationId);
  };

  const rejectConversation = (conversationId) => {
    socket.emit("rejectConversation", conversationId);
  };

  const joinConversation = (conversationId) => {
    socket.emit("joinConversation", conversationId);
  };

  return {
    messages,
    requests,
    sendMessage,
    acceptConversation,
    rejectConversation,
    joinConversation,
  };
};

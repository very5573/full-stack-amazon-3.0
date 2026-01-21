"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatSocket } from "../../../utils/socket";
import {
  addMessage,
  addRequest,
  acceptConversationSuccess,
  rejectConversationSuccess,
  setConversationMessages,
  addConversationIfNotExists,
  setSelectedConversationId,
} from "../../../redux/slices/conversationSlice";

// ✅ Global socket to prevent HMR remount issues
let globalSocket = null;

const ChatSocketComponent = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?._id || currentUser?.id;
  const conversations = useSelector((state) => state.conversation.conversations);

  useEffect(() => {
    if (!userId) return;

    // Initialize global socket once
    if (!globalSocket) {
      console.log("⚡ [Socket] Initializing global socket...");
      globalSocket = chatSocket;

      globalSocket.on("connect", () => {
        console.log("🔗 [Socket] Connected:", globalSocket.id);
        globalSocket.emit("joinPersonalRoom", userId);
        console.log("📌 [Socket] Joined personal room:", userId);
      });

      globalSocket.on("disconnect", (reason) => {
        console.log("⚡ [Socket] Disconnected:", reason);
      });

      globalSocket.on("connect_error", (err) => {
        console.error("❌ [Socket] Connection error:", err);
      });

      globalSocket.connect();
    }

    const socket = globalSocket;

    // Event handlers
    const handleNewMessage = ({ message, conversation }) => {
      console.log("🟢 [Socket] New message:", message);
      dispatch(addConversationIfNotExists(conversation));
      dispatch(addMessage({ conversationId: conversation._id, message }));

      if (!conversations.find((c) => c._id === conversation._id)) {
        console.log("📌 [Socket] Auto-selecting conversation:", conversation._id);
        dispatch(setSelectedConversationId(conversation._id));
        dispatch(setConversationMessages({ conversationId: conversation._id, messages: [message] }));
      }
    };

    const handleNewRequest = ({ conversation }) => {
      console.log("🟡 [Socket] New request:", conversation);
      dispatch(addRequest(conversation));
    };

    const handleRequestAccepted = ({ conversation, messages }) => {
      console.log("✅ [Socket] Request accepted:", conversation);
      dispatch(acceptConversationSuccess(conversation));
      dispatch(setConversationMessages({ conversationId: conversation._id, messages }));
    };

    const handleRequestRejected = ({ conversation }) => {
      console.log("❌ [Socket] Request rejected:", conversation._id);
      dispatch(rejectConversationSuccess(conversation._id));
    };

    // ✅ Add listeners only once
    if (!socket._hasListeners) {
      console.log("⚡ [Socket] Adding event listeners...");
      socket.on("newMessage", handleNewMessage);
      socket.on("newRequest", handleNewRequest);
      socket.on("requestAccepted", handleRequestAccepted);
      socket.on("requestRejected", handleRequestRejected);
      socket._hasListeners = true;
    }

    return () => {
      console.log("🧹 [Socket] Cleanup skipped (global socket)");
      // Cleanup skipped intentionally to avoid HMR disconnect
    };
  }, [userId, dispatch, conversations]);

  return null;
};

export default ChatSocketComponent;

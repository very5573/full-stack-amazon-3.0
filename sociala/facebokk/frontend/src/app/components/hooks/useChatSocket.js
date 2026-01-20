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
} from "../../../redux/slices/conversationSlice";

const ChatSocketComponent = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(chatSocket); // singleton socket

  const { user: currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    if (!userId) return;

    const socket = socketRef.current;

    // ---------- SOCKET LISTENERS ----------
    const handleConnect = () => console.log("🟢 Chat socket connected:", socket.id);
    const handleDisconnect = (reason) => console.warn("🔴 Chat socket disconnected:", reason);
    const handleConnectError = (err) => console.error("⚠️ Chat socket connect_error:", err.message);

    // Debug every incoming message
    const handleNewMessage = ({ message, conversation }) => {
      console.log("💬 New message received:", message?._id, "for conversation:", conversation?._id);
      if (!message || !conversation) return;

      dispatch(addConversationIfNotExists(conversation));
      dispatch(addMessage({ conversationId: conversation._id, message }));
    };

    const handleNewRequest = ({ conversation }) => {
      console.log("📨 New request received:", conversation?._id);
      dispatch(addRequest(conversation));
    };

    const handleRequestAccepted = ({ conversation, messages }) => {
      console.log("✅ Request accepted:", conversation?._id, "messages:", messages?.length);
      dispatch(acceptConversationSuccess(conversation));
      dispatch(setConversationMessages({ conversationId: conversation._id, messages }));
    };

    const handleRequestRejected = ({ conversation }) => {
      console.log("❌ Request rejected:", conversation?._id);
      dispatch(rejectConversationSuccess(conversation._id));
    };

    // ---------- REGISTER EVENTS ----------
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.on("newMessage", handleNewMessage);
    socket.on("newRequest", handleNewRequest);
    socket.on("requestAccepted", handleRequestAccepted);
    socket.on("requestRejected", handleRequestRejected);

    // Join personal room only once after connection
    if (!socket.connected) {
      socket.connect();
    }
    socket.once("connect", () => {
      console.log("🔹 Joining personal room:", userId);
      socket.emit("joinPersonalRoom", userId);
    });

    // ---------- CLEANUP ----------
    return () => {
      console.log("🧹 Cleaning up chat socket listeners");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("newMessage", handleNewMessage);
      socket.off("newRequest", handleNewRequest);
      socket.off("requestAccepted", handleRequestAccepted);
      socket.off("requestRejected", handleRequestRejected);

      // ⚠️ Do not disconnect singleton socket
      // socket.disconnect();
    };
  }, [userId, dispatch]);

  return null;
};

export default ChatSocketComponent;

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../utils/socket";

import { addLocalNotification } from "../../redux/slices/notificationSlice";
import {
  addIncomingMessage,
  fetchConversations,
} from "../../redux/slices/conversationSlice";
import { userOnline, userOffline } from "../../redux/slices/presenceSlice";

export default function SocketListener() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    if (!userId) return;

    // -------------------- CONNECT --------------------
    if (!socket.connected) socket.connect();

    const joinRoom = () => {
      socket.emit("join", userId);
    };

    if (socket.connected) joinRoom();
    else socket.once("connect", joinRoom);

    // -------------------- HANDLERS --------------------

    const handleNotification = (data) => {
      if (data) dispatch(addLocalNotification(data));
    };

    const handleNewMessage = ({ message }) => {
      if (!message) return;
      dispatch(addIncomingMessage(message));
    };

    const handleNewRequest = ({ conversation }) => {
      dispatch(addLocalNotification({ type: "request", conversation }));
    };

    const handleRequestAccepted = () => {
      dispatch(fetchConversations(userId));
    };

    const handleRequestRejected = () => {
      dispatch(fetchConversations(userId));
    };

    // 🔥 FIXED HERE (server sends { userId })
    const handleUserOnline = ({ userId }) => {
      dispatch(userOnline(userId));
    };

    const handleUserOffline = ({ userId, lastSeen }) => {
      dispatch(userOffline({ userId, lastSeen }));
    };

    const handleConnect = () => {
      console.log("🟢 Socket connected:", socket.id);
    };

    const handleDisconnect = (reason) => {
      console.warn("🔴 Socket disconnected:", reason);
    };

    // -------------------- LISTENERS --------------------
    socket.on("notification", handleNotification);
    socket.on("newMessage", handleNewMessage);
    socket.on("newRequest", handleNewRequest);
    socket.on("requestAccepted", handleRequestAccepted);
    socket.on("requestRejected", handleRequestRejected);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // -------------------- CLEANUP --------------------
    return () => {
      socket.off("notification", handleNotification);
      socket.off("newMessage", handleNewMessage);
      socket.off("newRequest", handleNewRequest);
      socket.off("requestAccepted", handleRequestAccepted);
      socket.off("requestRejected", handleRequestRejected);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [userId]); // dispatch not needed

  return null;
}

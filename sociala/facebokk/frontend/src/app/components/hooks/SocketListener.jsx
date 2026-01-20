"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  presenceSocket } from "../../../utils/socket";

import {
  userOnline,
  userOffline,
  setTyping,
  messageRead,
  userOnlineSnapshot,
} from "../../../redux/slices/realtimeSlice";

export default function SocketListener() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    if (!userId) return;

    // -------------------- CONNECT --------------------
    if (!presenceSocket.connected) presenceSocket.connect();

    // -------------------- JOIN PRESENCE ROOM --------------------
    presenceSocket.on("connect", () => {
      console.log("⚡ Presence socket connected:", presenceSocket.id);
      presenceSocket.emit("joinPresence", String(userId));
    });

    

    
    // -------------------- PRESENCE SOCKET LISTENERS --------------------
    // PRESENCE SOCKET LISTENERS
    presenceSocket.on("userOnline", ({ userId }) =>
      dispatch(userOnline(String(userId))),
    );

    presenceSocket.on("userOffline", ({ userId, lastSeen }) =>
      dispatch(userOffline({ userId: String(userId), lastSeen })),
    );

    presenceSocket.on(
      "onlineUsersSnapshot",
      ({ onlineUsers }) => dispatch(userOnlineSnapshot({ onlineUsers })), // ✅ pass object with key 'onlineUsers'
    );

    presenceSocket.on("typing", ({ senderId, isTyping }) =>
      dispatch(setTyping({ senderId: String(senderId), isTyping })),
    );

    presenceSocket.on("messageRead", ({ conversationId, readerId }) =>
      dispatch(messageRead({ conversationId, readerId })),
    );

    
    
    presenceSocket.on("disconnect", (reason) =>
      console.warn("Presence socket disconnected:", reason),
    );

    // -------------------- CLEANUP --------------------
    return () => {
      // Chat socket cleanup
      

      // Presence socket cleanup
      presenceSocket.off("userOnline");
      presenceSocket.off("userOffline");
      presenceSocket.off("onlineUsersSnapshot");
      presenceSocket.off("typing");
      presenceSocket.off("messageRead");
      presenceSocket.off("disconnect");
    };
  }, [userId, dispatch]);

  return null; // ✅ Component renders nothing
}

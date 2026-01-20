"use client";

import { useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  fetchMessages,
  addMessage,
  addConversationIfNotExists,
  setSelectedConversationId,
} from "../../../redux/slices/conversationSlice";
import { chatSocket } from "../../../utils/socket";
import ChatInput from "./ChatInput";
import { store } from "../../../redux/store"; // redux store for direct getState

export default function ChatScreen() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(chatSocket);

  // ---------------- AUTH ----------------
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;

  // ---------------- CONVERSATION STATE ----------------
  const { selectedConversationId, conversations, messagesByConversation } =
    useSelector((state) => state.conversation, shallowEqual);

  // ---------------- CURRENT CONVERSATION ----------------
  const currentConversation = useMemo(
    () => conversations.find((c) => c._id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  const otherUser = useMemo(
    () =>
      currentConversation?.members?.find((m) => (m._id || m.id) !== currentUserId) ||
      {},
    [currentConversation, currentUserId]
  );

  // ---------------- MESSAGES ----------------
  const conversationMessages = useMemo(
    () => messagesByConversation[selectedConversationId] || [],
    [messagesByConversation, selectedConversationId]
  );

  // ---------------- FETCH MESSAGES ON SELECT ----------------
  useEffect(() => {
    if (!selectedConversationId) return;
    dispatch(fetchMessages(selectedConversationId));
  }, [selectedConversationId, dispatch]);

  // ---------------- SOCKET REAL-TIME MESSAGES ----------------
  useEffect(() => {
    if (!currentUserId) return;
    const socket = socketRef.current;

    if (!socket.connected) socket.connect();
    socket.emit("joinPersonalRoom", currentUserId);

    const handleNewMessage = ({ message, conversation }) => {
      if (!message || !conversation) return;

      // Add conversation if not exists
      dispatch(addConversationIfNotExists(conversation));

      // Add message to messages
      dispatch(addMessage({ conversationId: conversation._id, message }));

      // ---------------- AUTO-SELECT ----------------
      const selectedId = store.getState().conversation.selectedConversationId;
      if (selectedId !== conversation._id) {
        dispatch(setSelectedConversationId(conversation._id));
        console.log("🎯 Auto-selected conversation:", conversation._id);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [currentUserId, dispatch]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages.length]);

  // ---------------- EMPTY STATE ----------------
  if (!selectedConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chat
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b sticky top-0 bg-white z-10">
        <img
          src={otherUser?.avatar?.url || "/default-avatar.png"}
          alt={otherUser?.name || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold">{otherUser?.name || "User"}</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {conversationMessages.map((msg) => {
          const senderId =
            typeof msg.senderId === "string" ? msg.senderId : msg.senderId?._id;
          const isOwn = senderId === currentUserId;

          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                  isOwn
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="sticky bottom-0 bg-white border-t">
        <ChatInput />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../utils/axiosInstance";
import { setConversationMessages } from "../../../redux/slices/conversationSlice";
import ChatInput from "./ChatInput";

export default function ChatScreen() {
  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth?.user);
  const userId = String(currentUser?._id || currentUser?.id);

  const conversationId = useSelector(
    (state) => state.conversation.selectedConversationId
  );

  const messages =
    useSelector(
      (state) => state.conversation.messagesByConversation[conversationId]
    ) || [];

  const [loading, setLoading] = useState(false);

  // 🔹 Auto scroll
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // 🔹 Fetch messages from API
  const getMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      const res = await API.get(`/messages/${conversationId}`);

      const existingIds = new Set(messages.map((m) => m._id));
      const newMessages = res.data.messages.filter((m) => !existingIds.has(m._id));

      if (newMessages.length > 0) {
        dispatch(
          setConversationMessages({
            conversationId,
            messages: [...messages, ...newMessages],
          })
        );
      }

      setLoading(false);
    } catch (err) {
      console.error("❌ Fetch messages:", err);
      setLoading(false);
    }
  }, [conversationId, messages, dispatch]);

  // 🔹 Fetch messages on conversation change
  useEffect(() => {
    getMessages();
  }, [getMessages]);

  // 🔹 Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      console.log("📨 Messages updated:", messages[messages.length - 1]);
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // 🔹 Find other user in conversation
  const otherUser =
    messages.find((m) => String(m.senderId?._id) !== userId)?.senderId ||
    messages[0]?.receiverId;

  return (
    <div className="flex flex-col h-full w-full bg-[#0b0b0b]">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
        <img
          src={otherUser?.avatar?.url || "/default-avatar.png"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-white font-semibold">
            {otherUser?.name || "Chat"}
          </p>
          <p className="text-xs text-gray-400">
            {otherUser?.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {loading && (
          <p className="text-center text-gray-400 text-sm">Loading...</p>
        )}

        {messages.map((msg, index) => {
          const isMe = String(msg.senderId?._id) === userId;
          const key = msg._id ? `${msg._id}-${index}` : index;

          return (
            <div
              key={key}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-gray-800 text-white rounded-bl-sm"
                }`}
              >
                {msg.text}
                <p className="text-[10px] text-gray-300 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <ChatInput />
    </div>
  );
}

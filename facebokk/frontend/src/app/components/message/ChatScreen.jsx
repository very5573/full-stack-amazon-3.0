"use client";

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessages } from "../../../redux/slices/conversationSlice";
import ChatInput from "./ChatInput";

export default function ChatScreen() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;

  const { selectedConversationId, conversations, loading } =
    useSelector((state) => state.conversation);

  // 🔹 Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      dispatch(fetchMessages(selectedConversationId));
    }
  }, [selectedConversationId, dispatch]);

  // 🔹 Conversation object
  const conversation = selectedConversationId
    ? conversations[selectedConversationId]
    : null;

  const messages = conversation || [];

  // 🔹 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 No chat selected
  if (!selectedConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chat
      </div>
    );
  }

  // 🔹 Other user (for header)
  const chatUser =
    messages.find((m) => m.senderId?._id !== currentUserId)?.senderId || {};

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3 px-4 py-3 border-b sticky top-0 bg-white z-10">
        <img
          src={chatUser.avatar?.url || "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold">{chatUser.name || "User"}</p>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {loading && (
          <p className="text-center text-sm text-gray-400">
            Loading messages...
          </p>
        )}

        {messages.map((msg, idx) => {
          const isOwn = msg.senderId?._id === currentUserId;
          const key = `${msg._id}-${idx}`;

          return (
            <div
              key={key}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm break-words ${
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

      {/* ================= INPUT ================= */}
      <div className="sticky bottom-0 bg-white z-10 border-t">
        <ChatInput />
      </div>
    </div>
  );
}

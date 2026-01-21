"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../../../utils/axiosInstance";
import {
  addMessage,
  addConversationIfNotExists,
  setConversationMessages,
} from "../../../redux/slices/conversationSlice";

export default function ChatInput() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const currentUser = useSelector((state) => state.auth?.user);
  const userId = String(currentUser?._id || currentUser?.id);

  const selectedConversationId = useSelector(
    (state) => state.conversation.selectedConversationId
  );

  // 🔹 Safe receiver detection
  const otherUser = useSelector((state) => {
    const conversation = state.conversation.conversations.find(
      (c) => c._id === selectedConversationId
    );
    if (!conversation) return null;
    return conversation.members.find((m) => String(m._id) !== userId);
  });

  const handleSend = async () => {
    if (!text.trim()) return;

    // 🔹 Safety check: new conversation must have receiver
    if (!otherUser && !selectedConversationId) {
      console.warn("No receiver selected, cannot send message!");
      return;
    }

    const payload = {
      senderId: userId,
      receiverId: otherUser?._id,
      text,
      conversationId: selectedConversationId || undefined,
    };

    console.log("Sending message payload:", payload);

    try {
      const { data } = await API.post("/message", payload);

      // ✅ Add message to Redux
      dispatch(
        addMessage({
          conversationId: data.conversation._id,
          message: data.message,
        })
      );

      // ✅ If new conversation, add conversation & messages
      if (!selectedConversationId) {
        dispatch(addConversationIfNotExists(data.conversation));
        dispatch(
          setConversationMessages({
            conversationId: data.conversation._id,
            messages: [data.message],
          })
        );
      }

      setText(""); // clear input
    } catch (err) {
      console.error("❌ Send message error:", err.response?.data || err);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t border-gray-700">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button
        onClick={handleSend}
        className="text-blue-500 font-semibold"
      >
        Send
      </button>
    </div>
  );
}

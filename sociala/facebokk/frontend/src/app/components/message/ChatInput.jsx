"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  sendMessage,
} from "../../../redux/slices/conversationSlice";

export default function ChatInput() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  // ---------------- CURRENT USER ----------------
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;

  console.log("🧠 currentUser:", currentUser);
  console.log("🧠 currentUserId:", currentUserId);

  // ---------------- CONVERSATION ----------------
  const selectedConversationId = useSelector(
    (state) => state.conversation.selectedConversationId
  );
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );

  console.log("🧠 selectedConversationId:", selectedConversationId);
  console.log("🧠 conversations:", conversations);

  const currentConversation = conversations.find(
    (c) => c._id === selectedConversationId
  );
  console.log("🧠 currentConversation:", currentConversation);

  // ---------------- RECEIVER ----------------
  const receiver = currentConversation?.members?.find(
    (m) => (m._id || m.id || m) !== currentUserId
  );
  const receiverId = receiver?._id || receiver?.id || receiver;

  console.log("🧠 receiver object:", receiver);
  console.log("🧠 receiverId:", receiverId);

  // ---------------- SEND HANDLER ----------------
  const handleSend = async (e) => {
    e.preventDefault();

    console.log("🟡 Send clicked");
    console.log("🟡 text:", text);

    // 🔴 Guard checks
    if (!text.trim()) {
      console.warn("❌ Text empty");
      return;
    }
    if (!selectedConversationId) {
      console.warn("❌ selectedConversationId missing");
      return;
    }
    if (!receiverId) {
      console.warn("❌ receiverId missing");
      return;
    }

    // 1️⃣ Temp message
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: selectedConversationId,
      text,
      createdAt: new Date().toISOString(),
      senderId: {
        _id: currentUserId,
        name: currentUser?.name,
        avatar: currentUser?.avatar,
      },
      receiverId: { _id: receiverId },
      temp: true,
    };

    console.log("🟢 tempMessage:", tempMessage);

    dispatch(
      addMessage({
        conversationId: selectedConversationId,
        message: tempMessage,
      })
    );

    setText("");

    try {
      console.log("🚀 Sending API request...");
      const result = await dispatch(
        sendMessage({
          senderId: currentUserId,
          receiverId,
          text,
          conversationId: selectedConversationId,
        })
      ).unwrap();
      console.log("✅ API SUCCESS:", result);
    } catch (err) {
      console.error("❌ API FAILED:", err);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-2 px-3 py-2 border-t bg-white"
    >
      <input
        type="text"
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-full text-sm"
      />

      <button
        type="submit"
        disabled={!text.trim()}
        className="text-blue-500 font-semibold disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}

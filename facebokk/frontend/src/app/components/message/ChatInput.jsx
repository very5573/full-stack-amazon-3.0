"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../../redux/slices/chatActionSlice";

export default function ChatInput() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;

  const selectedConversationId = useSelector(
    (state) => state.conversation.selectedConversationId
  );

  const sendingMessage = useSelector(
    (state) => state.chatAction.sendingMessage
  );

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedConversationId || !currentUserId) return;

    try {
      await dispatch(
        sendMessage({
          senderId: currentUserId,
          receiverId: null, // backend khud resolve karega
          text,
          conversationId: selectedConversationId,
        })
      ).unwrap();

      setText(""); // ✅ clear input only
    } catch (err) {
      console.error("❌ Send message failed:", err);
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
        disabled={sendingMessage}
        className="flex-1 px-4 py-2 border rounded-full focus:outline-none text-sm"
      />

      <button
        type="submit"
        disabled={sendingMessage || !text.trim()}
        className="text-blue-500 font-semibold disabled:opacity-40"
      >
        Send
      </button>
    </form>
  );
}

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversations,
  setSelectedConversationId,
} from "../../../redux/slices/conversationSlice";

export default function InboxList() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth?.user);
  const userId = currentUser?._id || currentUser?.id;

  const conversations = useSelector(
    (state) => state.conversation.conversationsList ?? []
  );

  const selectedConversationId = useSelector(
    (state) => state.conversation.selectedConversationId
  );

  // 🔥 Inbox fetch (ONLY accepted conversations)
  useEffect(() => {
    if (userId) {
      dispatch(fetchConversations(userId));
    }
  }, [userId, dispatch]);

  if (!conversations.length) {
    return (
      <div className="p-4 text-gray-500">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto border-r">
      {conversations.map((conv) => {
        const otherUser = conv.members?.find(
          (m) => m._id !== userId
        );

        if (!otherUser) return null;

        return (
          <div
            key={conv._id}
            onClick={() =>
              dispatch(setSelectedConversationId(conv._id))
            }
            className={`flex items-center gap-3 p-3 cursor-pointer border-b
              ${
                conv._id === selectedConversationId
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
          >
            <img
              src={otherUser.avatar?.url || "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
              alt={otherUser.name}
            />

            <div>
              <p className="font-medium text-sm">
                {otherUser.name}
              </p>
              <p className="text-xs text-gray-500">
                Tap to open chat
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

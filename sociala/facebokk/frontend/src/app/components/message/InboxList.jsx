"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../utils/axiosInstance";
import {
  setSelectedConversationId,
  addConversationIfNotExists,
  setConversationMessages, // Messages set करने के लिए, अगर API fetch करना है
} from "../../../redux/slices/conversationSlice";

export default function InboxList() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth?.user);
  const userId = String(currentUser?._id || currentUser?.id);

  const selectedConversationId = useSelector(
    (state) => state.conversation.selectedConversationId
  );

  const conversations = useSelector((state) => state.conversation.conversations);

  // Socket / realtime users from Redux
  const onlineUsers = useSelector((state) => state.realtime.onlineUsers);
  const typingUsers = useSelector((state) => state.realtime.typingUsers);

  // ---------------- FETCH CONVERSATIONS ----------------
  useEffect(() => {
    const fetchInbox = async () => {
      if (!userId) return;

      try {
        const { data } = await API.get(`/conversations/${userId}`);
        const convs = data?.conversations || [];

        // Redux store में populate करो
        convs.forEach((conv) => dispatch(addConversationIfNotExists(conv)));
      } catch (err) {
        console.error("❌ Failed to fetch conversations:", err);
      }
    };

    fetchInbox();
  }, [userId, dispatch]);

  // ---------------- FUNCTION: Get online/lastSeen ----------------
  const getUserStatus = (otherUser) => {
    const otherUserId = String(otherUser._id);
    const socketPresence = onlineUsers?.[otherUserId];
    const lastSeenFallback = otherUser.lastSeen;

    if (socketPresence) {
      return {
        isOnline: socketPresence.online,
        lastSeen: socketPresence.lastSeen || lastSeenFallback || null,
      };
    }

    return {
      isOnline: false,
      lastSeen: lastSeenFallback || null,
    };
  };

  // ---------------- RENDER ----------------
  if (!conversations.length) {
    return <div className="p-4 text-gray-500">No conversations yet</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto border-r">
      {conversations.map((conv) => {
        const otherUser = conv.members?.find((m) => String(m._id) !== userId);
        if (!otherUser) return null;

        const { isOnline, lastSeen } = getUserStatus(otherUser);
        const isTyping = typingUsers?.[otherUser._id] || false;

        return (
          <div
            key={conv._id}
            onClick={() => dispatch(setSelectedConversationId(conv._id))}
            className={`flex items-center gap-3 p-3 cursor-pointer border-b
              ${conv._id === selectedConversationId ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            {/* AVATAR */}
            <div className="relative">
              <img
                src={otherUser.avatar?.url || "/default-avatar.png"}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* NAME + STATUS */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{otherUser.name}</p>

              {isTyping ? (
                <p className="text-xs text-green-600">typing…</p>
              ) : isOnline ? (
                <p className="text-xs text-gray-500">Online</p>
              ) : lastSeen ? (
                <p className="text-xs text-gray-400 truncate">
                  Last seen{" "}
                  {new Date(lastSeen).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

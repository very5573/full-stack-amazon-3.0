"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../utils/axiosInstance";
import {
  setSelectedConversationId,
  addConversationIfNotExists,
} from "../../../redux/slices/conversationSlice";

const UserSearchInput = () => {
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;

  const conversations = useSelector((state) => state.conversation.conversations);

  // ------------------ SEARCH USERS ------------------
  useEffect(() => {
    if (!query.trim() || !currentUserId) {
      setUsers([]);
      return;
    }

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await API.get(
          `/search?q=${encodeURIComponent(query)}&userId=${currentUserId}`
        );
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Search error:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query, currentUserId]);

  // ------------------ HANDLE USER CLICK ------------------
  const handleUserClick = async (user) => {
    if (!user || !user._id) return;

    try {
      // 1️⃣ Check if conversation already exists
      const existingConversation = conversations.find((c) =>
        c.members.some((m) => m._id === user._id)
      );

      if (existingConversation) {
        // Already exists → select it
        dispatch(setSelectedConversationId(existingConversation._id));
        setQuery("");
        setUsers([]);
        return;
      }

      // 2️⃣ Create new conversation via API
      const res = await API.post("/chats", { receiverId: user._id });
      const conversation = res?.data?.conversation;

      if (!conversation) {
        console.error("❌ conversation object missing in API response");
        return;
      }

      // 3️⃣ Update Redux
      dispatch(addConversationIfNotExists(conversation));
      dispatch(setSelectedConversationId(conversation._id));

      // Clear search
      setQuery("");
      setUsers([]);
    } catch (err) {
      console.error("🔥 handleUserClick error:", err);
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users"
        className="w-full px-4 py-2 border rounded-lg"
      />

      {query && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-lg z-50 max-h-80 overflow-y-auto">
          {loading && <div className="p-3 text-sm text-gray-500">Searching...</div>}

          {!loading && users.length === 0 && (
            <div className="p-3 text-sm text-gray-500">No users found</div>
          )}

          {!loading &&
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="flex gap-3 p-3 cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={user.avatar?.url || "/default-avatar.png"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">@{user.username || "unknown"}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;

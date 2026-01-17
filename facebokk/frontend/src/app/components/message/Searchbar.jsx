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
const handleUserClick = async (user) => {
  console.group("🟢 handleUserClick start");
  console.log("Selected user:", user);

  if (!user || !user._id) {
    console.warn("❌ Invalid user clicked");
    console.groupEnd();
    return;
  }

  try {
    console.log("📡 Creating/fetching conversation via API...");
    const res = await API.post("/chats", { receiverId: user._id });
    console.log("✅ API response:", res?.data);

    // Extract conversation ID from response
    const chatId =
      res?.data?.conversation?._id ||
      res?.data?.conversationId ||
      res?.data?._id;

    if (!chatId) {
      console.error("❌ chatId missing in API response");
      console.groupEnd();
      return;
    }

    console.log("🟢 chatId resolved:", chatId);

    // Update Redux
    console.log("📌 Dispatching addConversationIfNotExists and setSelectedConversationId");
    dispatch(addConversationIfNotExists(chatId));
    dispatch(setSelectedConversationId(chatId));

    // Clear search input
    setQuery("");
    setUsers([]);
    console.log("🟢 Search input cleared, users list reset");

    console.groupEnd();
  } catch (err) {
    console.error("🔥 handleUserClick error:", err);
    console.groupEnd();
  }
};

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

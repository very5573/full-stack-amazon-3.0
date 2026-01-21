"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../utils/axiosInstance";
import {
  acceptRequest,
  rejectRequest,
  fetchMessageRequests,
} from "../../../redux/slices/chatActionSlice";
import { addConversationIfNotExists } from "../../../redux/slices/conversationSlice";

export default function RequestList() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth?.user);
  const userId = currentUser?._id || currentUser?.id;

  const requests = useSelector((state) => state.chatAction?.requests ?? []);
  const loading = useSelector((state) => state.chatAction?.loadingRequests ?? false);

  // 🔹 Fetch pending requests
  useEffect(() => {
    if (!userId) return;
    dispatch(fetchMessageRequests(userId));
  }, [userId, dispatch]);

  // 🔹 Direct API call to fetch conversations after accept
  const fetchUserConversations = async () => {
    if (!userId) return;
    try {
      const { data } = await API.get(`/conversations/${userId}`);
      if (data?.conversations?.length) {
        data.conversations.forEach((c) => dispatch(addConversationIfNotExists(c)));
      }
    } catch (err) {
      console.error("❌ fetchUserConversations error:", err);
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Loading requests...</p>;
  if (!requests.length) return <p className="p-4 text-gray-400">No message requests</p>;

  return (
    <div className="p-4 space-y-4">
      {requests.map((req) => {
        const otherUser = req.members?.find((m) => m._id !== userId);
        if (!otherUser) return null;

        return (
          <div
            key={req._id}
            className="flex items-center justify-between p-3 border rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <img
                src={otherUser.avatar?.url || "/default-avatar.png"}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{otherUser.name}</p>
                <p className="text-sm text-gray-500">Sent you a message</p>
              </div>
            </div>

            <div className="flex space-x-2">
              {/* ✅ ACCEPT */}
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={async () => {
                  try {
                    await dispatch(acceptRequest(req._id)).unwrap();
                    dispatch(fetchMessageRequests(userId)); // refresh requests
                    await fetchUserConversations(); // refresh conversations
                  } catch (err) {
                    console.error("❌ Accept request failed:", err);
                  }
                }}
              >
                Accept
              </button>

              {/* ❌ REJECT */}
              <button
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={async () => {
                  try {
                    await dispatch(rejectRequest(req._id)).unwrap();
                    dispatch(fetchMessageRequests(userId)); // refresh requests
                  } catch (err) {
                    console.error("❌ Reject request failed:", err);
                  }
                }}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

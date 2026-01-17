"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Components
import UserSearchInput from "../components/message/Searchbar";
import InboxList from "../components/message/InboxList";
import RequestList from "../components/message/RequestList";
import ChatScreen from "../components/message/ChatScreen"; // ✅ import chat screen

// MUI Icon
import CloseIcon from "@mui/icons-material/Close";

const InstagramDMModal = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  // inbox | requests
  const [activeTab, setActiveTab] = useState("inbox");

  // Close modal
  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* LEFT SIDEBAR */}
      <div className="w-[360px] h-full border-r flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar || "/default-avatar.png"}
              className="w-8 h-8 rounded-full object-cover"
              alt="user"
            />
            <span className="font-semibold text-sm">
              {user?.username || user?.name}
            </span>
          </div>

          <button onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* SEARCHBAR */}
        <div className="px-3 py-2 border-b">
          <UserSearchInput />
        </div>

        {/* TABS */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "inbox"
                ? "border-b-2 border-black text-black"
                : "text-gray-400"
            }`}
          >
            Inbox
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "requests"
                ? "border-b-2 border-black text-black"
                : "text-gray-400"
            }`}
          >
            Requests
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "inbox" && <InboxList />}
          {activeTab === "requests" && <RequestList />}
        </div>
      </div>

      {/* RIGHT CHAT SCREEN */}
      <div className="flex-1 bg-gray-50">
        <ChatScreen /> {/* ✅ user click par messages fetch aur render */}
      </div>
    </div>
  );
};

export default InstagramDMModal;

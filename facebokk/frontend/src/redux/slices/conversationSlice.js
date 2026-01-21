import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  pendingRequests: [],
  selectedConversationId: null,
  messagesByConversation: {}, // { conversationId: [messages] }
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // ---------------- CONVERSATIONS ----------------
    addConversationIfNotExists: (state, action) => {
      const convo = action.payload;
      const exists = state.conversations.find(c => c._id === convo._id);
      if (!exists) {
        state.conversations.unshift(convo);
        console.log("✅ New conversation added:", convo);
      } else {
        console.log("ℹ️ Conversation already exists:", convo._id);
      }
    },

    setSelectedConversationId: (state, action) => {
      state.selectedConversationId = action.payload;
      console.log("📌 Selected conversationId set:", action.payload);
    },

    // ---------------- MESSAGES ----------------
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }

      const exists = state.messagesByConversation[conversationId].some(
        (m) => m._id === message._id
      );

      if (!exists) {
        state.messagesByConversation[conversationId].push(message);
        console.log(
          "🟢 New message added to conversation:",
          conversationId,
          message
        );
      } else {
        console.log(
          "ℹ️ Message already exists in conversation:",
          conversationId,
          message._id
        );
      }

      // Debug: show all messages of this conversation
      console.log(
        "📨 Messages for conversation",
        conversationId,
        state.messagesByConversation[conversationId]
      );
    },

    setConversationMessages: (state, action) => {
      const { conversationId, messages } = action.payload;

      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }

      // Merge without duplicates
      const existingIds = new Set(
        state.messagesByConversation[conversationId].map((m) => m._id)
      );

      const newMessages = messages.filter((m) => !existingIds.has(m._id));
      state.messagesByConversation[conversationId] = [
        ...state.messagesByConversation[conversationId],
        ...newMessages,
      ];

      console.log(
        "🟢 setConversationMessages called for conversation:",
        conversationId
      );
      console.log("📨 Total messages after merge:", state.messagesByConversation[conversationId]);
    },

    // ---------------- REQUESTS ----------------
    addRequest: (state, action) => {
      const convo = action.payload;
      const exists = state.pendingRequests.find(r => r._id === convo._id);
      if (!exists) {
        state.pendingRequests.unshift(convo);
        console.log("✅ New request added:", convo);
      } else {
        console.log("ℹ️ Request already exists:", convo._id);
      }
    },

    removeRequest: (state, action) => {
      state.pendingRequests = state.pendingRequests.filter(
        r => r._id !== action.payload
      );
      console.log("❌ Request removed:", action.payload);
    },

    acceptConversationSuccess: (state, action) => {
      const convo = action.payload;
      state.pendingRequests = state.pendingRequests.filter(r => r._id !== convo._id);
      state.conversations.unshift(convo);
      console.log("✅ Conversation accepted:", convo);
    },

    rejectConversationSuccess: (state, action) => {
      state.pendingRequests = state.pendingRequests.filter(r => r._id !== action.payload);
      console.log("❌ Conversation rejected:", action.payload);
    },
  },
});

export const {
  addConversationIfNotExists,
  setSelectedConversationId,
  addMessage,
  setConversationMessages,
  addRequest,
  removeRequest,
  acceptConversationSuccess,
  rejectConversationSuccess,
} = conversationSlice.actions;

export default conversationSlice.reducer;

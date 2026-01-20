import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// -------------------- ASYNC THUNKS --------------------
export const sendMessage = createAsyncThunk(
  "conversation/sendMessage",
  async ({ senderId, receiverId, text, conversationId }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/message", { senderId, receiverId, text, conversationId });
      console.log("📤 API sendMessage response:", data);
      return data; // backend → { message, conversation }
    } catch (err) {
      console.error("❌ sendMessage ERROR:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "conversation/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/messages/${conversationId}`);
      console.log(`📥 fetchMessages for conversation ${conversationId}:`, data.messages.length, "messages");
      return { conversationId, messages: data.messages };
    } catch (err) {
      console.error("❌ fetchMessages ERROR:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// -------------------- INITIAL STATE --------------------
const initialState = {
  conversations: [],             // Accepted conversations
  pendingRequests: [],           // Pending requests
  selectedConversationId: null,  // Currently open conversation
  messagesByConversation: {},    // { conversationId: [messages] }
};

// -------------------- SLICE --------------------
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // -------------------- CONVERSATIONS --------------------
    addConversationIfNotExists: (state, action) => {
      const conversation = action.payload;
      const exists = state.conversations.find(c => c._id === conversation._id);
      if (!exists) {
        state.conversations.unshift(conversation);
        console.log("✅ Conversation added:", conversation._id);
      }
    },
    setSelectedConversationId: (state, action) => {
      state.selectedConversationId = action.payload;
      console.log("🎯 Selected conversation:", action.payload);
    },

    // -------------------- MESSAGES --------------------
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const messages = state.messagesByConversation[conversationId] || [];

      // Immutable update to trigger re-render
      if (!messages.some(m => m._id === message._id)) {
        state.messagesByConversation[conversationId] = [...messages, message];
        console.log(`📥 New message added to conversation ${conversationId}:`, message._id);
      }
    },
    setConversationMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      // Immutable assignment
      state.messagesByConversation[conversationId] = [...messages];
      console.log(`📥 Messages set for conversation ${conversationId}: ${messages.length} messages`);
    },

    // -------------------- PENDING REQUESTS --------------------
    addRequest: (state, action) => {
      const conversation = action.payload;
      const exists = state.pendingRequests.find(c => c._id === conversation._id);
      if (!exists) {
        state.pendingRequests.unshift(conversation);
        console.log("📨 New pending request:", conversation._id);
      }
    },
    removeRequest: (state, action) => {
      const conversationId = action.payload;
      state.pendingRequests = state.pendingRequests.filter(c => c._id !== conversationId);
      console.log("🗑️ Pending request removed:", conversationId);
    },
    acceptConversationSuccess: (state, action) => {
      const conversation = action.payload;
      state.pendingRequests = state.pendingRequests.filter(c => c._id !== conversation._id);
      const exists = state.conversations.find(c => c._id === conversation._id);
      if (!exists) state.conversations.unshift(conversation);
      console.log("✅ Conversation accepted:", conversation._id);
    },
    rejectConversationSuccess: (state, action) => {
      const conversationId = action.payload;
      state.pendingRequests = state.pendingRequests.filter(c => c._id !== conversationId);
      console.log("❌ Conversation rejected:", conversationId);
    },
  },
  extraReducers: (builder) => {
    // -------------------- FETCH MESSAGES --------------------
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messagesByConversation[conversationId] = [...messages]; // Immutable
      console.log(`📥 fetchMessages fulfilled for conversation ${conversationId}:`, messages.length);
    });

    // -------------------- SEND MESSAGE --------------------
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      const { conversation } = action.payload;
      if (!conversation) return;

      const exists = state.conversations.find(c => c._id === conversation._id);
      if (!exists) {
        state.conversations.unshift(conversation);
        console.log("📤 Conversation added after sendMessage:", conversation._id);
      } else {
        exists.lastMessage = conversation.lastMessage;
        console.log("📤 Conversation updated after sendMessage:", conversation._id);
      }
    });
  },
});

// -------------------- EXPORT ACTIONS --------------------
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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";
import { acceptRequest, rejectRequest } from "./chatActionSlice";

// =======================
// THUNKS
// =======================

// 1️⃣ Fetch all conversations (Inbox list)
export const fetchConversations = createAsyncThunk(
  "conversation/fetchConversations",
  async (userId, { rejectWithValue }) => {
    try {
      console.group("📡 fetchConversations");
      console.log("UserId:", userId);

      const { data } = await API.get(`/conversations/${userId}`);
      console.log("✅ API response:", data);

      if (!data || !data.conversations) {
        console.warn("⚠️ conversations missing in response");
        return [];
      }

      console.groupEnd();
      return data.conversations;
    } catch (err) {
      console.error("❌ fetchConversations error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2️⃣ Fetch messages of a conversation
export const fetchMessages = createAsyncThunk(
  "conversation/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      console.group("📡 fetchMessages");
      console.log("ConversationId:", conversationId);

      const { data } = await API.get(`/messages/${conversationId}`);
      console.log("✅ API response messages:", data);

      if (!data || !data.messages) {
        console.warn("⚠️ messages missing in response");
        return { conversationId, messages: [] };
      }

      console.groupEnd();
      return {
        conversationId,
        messages: data.messages,
      };
    } catch (err) {
      console.error("❌ fetchMessages error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 3️⃣ Fetch pending message requests
export const fetchMessageRequests = createAsyncThunk(
  "conversation/fetchMessageRequests",
  async (userId, { rejectWithValue }) => {
    try {
      console.group("📡 fetchMessageRequests");
      console.log("UserId:", userId);

      const { data } = await API.get(`/users/requests/${userId}`);
      console.log("✅ API response requests:", data);

      console.groupEnd();
      return data.requests || [];
    } catch (err) {
      console.error("❌ fetchMessageRequests error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// =======================
// SLICE
// =======================

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: {},        // { conversationId: messages[] }
    conversationsList: [],    // inbox list
    requests: [],             // message requests
    selectedConversationId: null,
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedConversationId: (state, action) => {
      console.log("🟢 setSelectedConversationId:", action.payload);
      state.selectedConversationId = action.payload;
    },

    addIncomingMessage: (state, action) => {
      const msg = action.payload;
      console.log("🟢 addIncomingMessage:", msg);

      if (!msg.conversationId) return;

      if (!state.conversations[msg.conversationId]) {
        state.conversations[msg.conversationId] = [];
      }

      state.conversations[msg.conversationId].push(msg);
    },

    addConversationIfNotExists: (state, action) => {
      const id = action.payload;
      console.log("🟢 addConversationIfNotExists:", id);

      if (!state.conversations[id]) {
        state.conversations[id] = [];
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // --------------------
      // FETCH CONVERSATIONS
      // --------------------
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationsList = action.payload;

        action.payload.forEach((conv) => {
          if (!state.conversations[conv._id]) {
            state.conversations[conv._id] = [];
          }
        });
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --------------------
      // FETCH MESSAGES
      // --------------------
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.conversations[conversationId] = messages;
      })

      // --------------------
      // FETCH REQUESTS
      // --------------------
      .addCase(fetchMessageRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })

      // --------------------
      // ACCEPT REQUEST
      // --------------------
      .addCase(acceptRequest.fulfilled, (state, action) => {
        const { conversation, messages } = action.payload;

        // 1️⃣ Remove from request list
        state.requests = state.requests.filter(req => req._id !== conversation._id);

        // 2️⃣ Add to inbox if not exists
        if (!state.conversations[conversation._id]) {
          state.conversations[conversation._id] = [];
        }

        // 3️⃣ Add messages
        state.conversations[conversation._id] = messages;

        // 4️⃣ Add to conversationsList if not already present
        if (!state.conversationsList.find(c => c._id === conversation._id)) {
          state.conversationsList.push(conversation);
        }
      })

      // --------------------
      // REJECT REQUEST
      // --------------------
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const conversationId = action.payload;

        // ❌ Just remove from request list
        state.requests = state.requests.filter(req => req._id !== conversationId);
      });
  },
});

export const {
  setSelectedConversationId,
  addIncomingMessage,
  addConversationIfNotExists,
} = conversationSlice.actions;

export default conversationSlice.reducer;

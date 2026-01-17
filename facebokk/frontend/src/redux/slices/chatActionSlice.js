import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// =======================
// ACTION THUNKS
// =======================

// 1️⃣ Send message (creates pending request if first message)
export const sendMessage = createAsyncThunk(
  "chatAction/sendMessage",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("📡 sendMessage payload:", payload);
      const { data } = await API.post("/message", payload);
      return data; // { message, conversation }
    } catch (err) {
      console.error("❌ sendMessage error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2️⃣ Accept message request
export const acceptRequest = createAsyncThunk(
  "chatAction/acceptRequest",
  async (conversationId, { rejectWithValue }) => {
    try {
      console.log("📡 acceptRequest:", conversationId);
      const { data } = await API.put(`/accept/${conversationId}`);
      // data = { conversation, messages }
      return data;
    } catch (err) {
      console.error("❌ acceptRequest error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 3️⃣ Reject message request
export const rejectRequest = createAsyncThunk(
  "chatAction/rejectRequest",
  async (conversationId, { rejectWithValue }) => {
    try {
      console.log("📡 rejectRequest:", conversationId);
      const { data } = await API.put(`/reject/${conversationId}`);
      return conversationId;
    } catch (err) {
      console.error("❌ rejectRequest error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// =======================
// SLICE
// =======================
const chatActionSlice = createSlice({
  name: "chatAction",
  initialState: {
    sendingMessage: false,
    acceptingRequest: false,
    rejectingRequest: false,
    error: null,
  },
  reducers: {
    clearChatActionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --------------------
      // SEND MESSAGE
      // --------------------
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        // Optional: could handle new pending request here
        console.log("✅ sendMessage fulfilled:", action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      })

      // --------------------
      // ACCEPT REQUEST
      // --------------------
      .addCase(acceptRequest.pending, (state) => {
        state.acceptingRequest = true;
        state.error = null;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.acceptingRequest = false;
        console.log("✅ acceptRequest fulfilled:", action.payload);
        // action.payload = { conversation, messages }
        // Here we could also trigger a redux action in conversationSlice
        // via extra logic in component or middleware
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.acceptingRequest = false;
        state.error = action.payload;
      })

      // --------------------
      // REJECT REQUEST
      // --------------------
      .addCase(rejectRequest.pending, (state) => {
        state.rejectingRequest = true;
        state.error = null;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.rejectingRequest = false;
        console.log("✅ rejectRequest fulfilled:", action.payload);
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.rejectingRequest = false;
        state.error = action.payload;
      });
  },
});

export const { clearChatActionError } = chatActionSlice.actions;
export default chatActionSlice.reducer;

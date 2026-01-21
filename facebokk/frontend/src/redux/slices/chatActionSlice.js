import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";


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
     

      // --------------------
      // ACCEPT REQUEST
      // --------------------
      .addCase(acceptRequest.pending, (state) => {
        state.acceptingRequest = true;
        state.error = null;
      })
      // --------------------
      .addCase(fetchMessageRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
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

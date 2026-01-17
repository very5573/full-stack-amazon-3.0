import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: {}, 
  // userId: { online: true, lastSeen }
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    userOnline: (state, action) => {
      const userId = action.payload;
      state.onlineUsers[userId] = {
        online: true,
        lastSeen: null,
      };
    },

    userOffline: (state, action) => {
      const { userId, lastSeen } = action.payload;
      state.onlineUsers[userId] = {
        online: false,
        lastSeen,
      };
    },
  },
});

export const { userOnline, userOffline } = presenceSlice.actions;

export default presenceSlice.reducer;

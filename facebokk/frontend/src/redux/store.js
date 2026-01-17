// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/authslice";
import conversationReducer from "./slices/conversationSlice";
import chatActionReducer from "./slices/chatActionSlice";
export const store = configureStore({
  reducer: {
    auth: userReducer,
    conversation: conversationReducer, // inbox, messages, selection
    chatAction: chatActionReducer,
  },
});

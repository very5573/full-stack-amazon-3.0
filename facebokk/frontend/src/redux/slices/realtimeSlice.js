import { createSlice } from "@reduxjs/toolkit";

/**
 * realtime state is ONLY for UI
 * Source of truth = socket events
 */
const initialState = {
  /**
   * userId -> {
   *   online: boolean,
   *   lastSeen: string | null
   * }
   */
  onlineUsers: {},

  /**
   * userId -> true
   * (temporary typing indicator)
   */
  typingUsers: {},

  /**
   * conversationId -> [userId]
   * (read receipts)
   */
  readByConversation: {},
};

const realtimeSlice = createSlice({
  name: "realtime",
  initialState,
  reducers: {
    // ===============================
    // 🟢 PRESENCE (ONLINE / OFFLINE)
    // ===============================

    /**
     * Fired when socket emits `userOnline`
     * payload = userId
     */
    userOnline: (state, action) => {
      const userId = String(action.payload);

      state.onlineUsers[userId] = {
        online: true,
        lastSeen: null,
      };
    },

    /**
     * Fired when socket emits `userOffline`
     * payload = { userId, lastSeen }
     */
    userOffline: (state, action) => {
      const { userId, lastSeen } = action.payload;

      state.onlineUsers[String(userId)] = {
        online: false,
        lastSeen,
      };
    },

    /**
     * Fired on socket connect
     * payload = { onlineUsers: [id1, id2, ...] }
     */
    userOnlineSnapshot: (state, action) => {
      const { onlineUsers } = action.payload;

      if (!Array.isArray(onlineUsers)) return;

      onlineUsers.forEach((userId) => {
        const id = String(userId);

        state.onlineUsers[id] = {
          online: true,
          lastSeen: null,
        };
      });
    },

    // ===============================
    // ✍️ TYPING INDICATOR
    // ===============================

    /**
     * payload = { senderId, isTyping }
     */
    setTyping: (state, action) => {
      const { senderId, isTyping } = action.payload;
      const id = String(senderId);

      if (isTyping) {
        state.typingUsers[id] = true;
      } else {
        delete state.typingUsers[id];
      }
    },

    /**
     * Clear all typing users
     * (used on logout / conversation switch)
     */
    clearTyping: (state) => {
      state.typingUsers = {};
    },

    // ===============================
    // ✅ MESSAGE READ RECEIPTS
    // ===============================

    /**
     * payload = { conversationId, readerId }
     */
    messageRead: (state, action) => {
      const { conversationId, readerId } = action.payload;

      if (!state.readByConversation[conversationId]) {
        state.readByConversation[conversationId] = [];
      }

      if (!state.readByConversation[conversationId].includes(readerId)) {
        state.readByConversation[conversationId].push(readerId);
      }
    },

    /**
     * Clear read receipts for one conversation
     */
    clearConversationRead: (state, action) => {
      delete state.readByConversation[action.payload];
    },

    // ===============================
    // 🔥 RESET (LOGOUT / SESSION END)
    // ===============================

    /**
     * Called on logout
     * Clears ALL realtime UI state
     */
    resetRealtime: () => initialState,
  },
});

export const {
  userOnline,
  userOffline,
  userOnlineSnapshot,
  setTyping,
  clearTyping,
  messageRead,
  clearConversationRead,
  resetRealtime,
} = realtimeSlice.actions;

export default realtimeSlice.reducer;

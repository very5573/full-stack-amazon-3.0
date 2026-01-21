import User from '../models/userModel.js'; // ✅ note .js extension

const onlineUsers = new Map();

export const initPresenceSocket = (presenceNamespace) => {
  presenceNamespace.on("connection", (socket) => {
    console.log("⚡ Presence connected:", socket.id);

    // ---------------------------
    // JOIN PRESENCE
    // ---------------------------
    socket.on("joinPresence", (userId) => {
      if (!userId) return;

      socket.userId = userId;
      socket.join(userId);

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, {
          sockets: new Set(),
        });

        // 🟢 USER ONLINE (others only)
        socket.broadcast.emit("userOnline", { userId });
      }

      onlineUsers.get(userId).sockets.add(socket.id);

      // 🔵 SNAPSHOT (new connection)
      socket.emit("onlineUsersSnapshot", {
        onlineUsers: Array.from(onlineUsers.keys()),
      });
    });

    // ---------------------------
    // 🔴 MANUAL LOGOUT (FIXED ✅)
    // ---------------------------
    socket.on("manualLogout", async () => {
      const userId = socket.userId;
      if (!userId) return;

      const lastSeen = new Date();

      try {
        // 1️⃣ DB UPDATE (for reload consistency)
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen,
        });

        // 2️⃣ Remove from memory
        onlineUsers.delete(userId);

        // 3️⃣ 🔥 REALTIME broadcast (others only)
        socket.broadcast.emit("userOffline", {
          userId,
          lastSeen,
        });

        // 4️⃣ disconnect socket
        socket.disconnect(true);
      } catch (err) {
        console.error("❌ manualLogout error:", err);
      }
    });

    // ---------------------------
    // DISCONNECT (tab close / net)
    // ---------------------------
    socket.on("disconnect", () => {
      const userId = socket.userId;
      if (!userId || !onlineUsers.has(userId)) return;

      const userData = onlineUsers.get(userId);
      userData.sockets.delete(socket.id);

      // ⏳ delay → multi-tab safe
      setTimeout(async () => {
        if (userData.sockets.size === 0) {
          const lastSeen = new Date();

          onlineUsers.delete(userId);

          // ✅ DB UPDATE
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen,
          });

          presenceNamespace.emit("userOffline", {
            userId,
            lastSeen,
          });
        }
      }, 2000);
    });

    // ---------------------------
    // TYPING
    // ---------------------------
    socket.on("typing", ({ senderId, receiverId, isTyping }) => {
      presenceNamespace.to(receiverId).emit("typing", {
        senderId,
        isTyping,
      });
    });

    // ---------------------------
    // MESSAGE READ
    // ---------------------------
    socket.on("messageRead", ({ conversationId, readerId, receiverId }) => {
      presenceNamespace.to(receiverId).emit("messageRead", {
        conversationId,
        readerId,
      });
    });
  });
};

export default initPresenceSocket;

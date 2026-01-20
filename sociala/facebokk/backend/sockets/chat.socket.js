import mongoose from "mongoose";
import User from "../models/userModel.js";
import Message from "../models/Messagemodel.js";
import Conversation from "../models/Conversationmodel.js";

export const initChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ Chat Socket connected:", socket.id);

    // ---------------------------
    // Debug any event
    // ---------------------------
    socket.onAny((event, ...args) => {
      console.log(`🔹 SOCKET EVENT: ${event}`, args);
    });

    // ---------------------------
    // PERSONAL ROOM JOIN
    // ---------------------------
    socket.on("joinPersonalRoom", async (userId) => {
      if (!userId) return;

      socket.join(userId.toString());
      console.log(`📥 User ${userId} joined personal room`);

      // Send unseen messages
      try {
        const messages = await Message.find({ receiverId: userId, read: false }).sort({ createdAt: 1 });
        for (const msg of messages) {
          const conversation = await Conversation.findById(msg.conversationId);
          io.to(userId.toString()).emit("newMessage", { message: msg, conversation });
        }
        console.log(`✅ Sent ${messages.length} unseen messages to user ${userId}`);
      } catch (err) {
        console.error("❌ Error sending unseen messages:", err);
      }
    });

    // ---------------------------
    // JOIN CONVERSATION ROOM
    // ---------------------------
    socket.on("joinConversation", (conversationId) => {
      if (!conversationId) return;
      socket.join(conversationId.toString());
      console.log(`👥 Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // ---------------------------
    // SEND MESSAGE
    // ---------------------------
    socket.on("sendMessage", async ({ senderId, receiverId, text, conversationId }) => {
      if (!senderId || !text) return;

      try {
        let conversation;
        if (conversationId) {
          conversation = await Conversation.findById(conversationId);
        } else {
          conversation = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });
          if (!conversation) {
            conversation = await Conversation.create({
              members: [senderId, receiverId],
              status: "pending",
              initiatedBy: senderId,
            });
          }
        }

        const actualReceiverId = conversation.members.find((id) => id.toString() !== senderId) || receiverId;

        // Create message
        let message = await Message.create({
          conversationId: conversation._id,
          senderId,
          receiverId: actualReceiverId,
          text,
        });

        message = await Message.findById(message._id)
          .populate("senderId", "name avatar.url")
          .populate("receiverId", "name avatar.url");

        conversation.lastMessage = text;
        await conversation.save();

        console.log("✅ Message saved & conversation updated:", { message: message._id, conversation: conversation._id });

        // Emit to **sender & receiver personal rooms**
        io.to(senderId.toString()).emit("newMessage", { message, conversation });
        io.to(actualReceiverId.toString()).emit("newMessage", { message, conversation });

        // Emit to conversation room (for multi-members)
        io.to(conversation._id.toString()).emit("newMessage", { message, conversation });

        // Pending request notification
        if (conversation.status === "pending") {
          io.to(actualReceiverId.toString()).emit("newRequest", { conversation });
        }
      } catch (err) {
        console.error("❌ sendMessage error:", err);
      }
    });

    // ---------------------------
    // ACCEPT / REJECT CONVERSATION
    // ---------------------------
    socket.on("acceptConversation", async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        conversation.status = "accepted";
        await conversation.save();

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        conversation.members.forEach((id) => {
          io.to(id.toString()).emit("requestAccepted", { conversation, messages });
        });
      } catch (err) {
        console.error("❌ acceptConversation error:", err);
      }
    });

    socket.on("rejectConversation", async (conversationId) => {
      try {
        const conversation = await Conversation.findByIdAndUpdate(
          conversationId,
          { status: "rejected" },
          { new: true }
        );
        if (!conversation) return;

        conversation.members.forEach((id) => {
          io.to(id.toString()).emit("requestRejected", { conversation });
        });
      } catch (err) {
        console.error("❌ rejectConversation error:", err);
      }
    });

    // ---------------------------
    // GET UNSEEN MESSAGES
    // ---------------------------
    socket.on("getUnseenMessages", async ({ userId }) => {
      if (!userId) return;
      try {
        const messages = await Message.find({ receiverId: userId, read: false });
        for (const msg of messages) {
          const conversation = await Conversation.findById(msg.conversationId);
          io.to(userId.toString()).emit("newMessage", { message: msg, conversation });
        }
      } catch (err) {
        console.error("❌ getUnseenMessages error:", err);
      }
    });

    // ---------------------------
    // DISCONNECT
    // ---------------------------
    socket.on("disconnect", () => {
      console.log("⚡ Chat Socket disconnected:", socket.id);
    });
  });
};

export default initChatSocket;

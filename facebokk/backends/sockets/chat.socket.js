import mongoose from "mongoose";
import User from "../models/userModel.js";
import Message from "../models/Messagemodel.js";
import Conversation from "../models/Conversationmodel.js";

export const initChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ Chat Socket connected:", socket.id);

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

      try {
        const messages = await Message.find({
          receiverId: userId,
          read: false,
        })
          .sort({ createdAt: 1 })
          .populate("senderId", "name avatar.url")
          .populate("receiverId", "name avatar.url");

        for (const msg of messages) {
          const conversation = await Conversation.findById(msg.conversationId)
            .populate("members", "name avatar.url");

          io.to(userId.toString()).emit("newMessage", { message: msg, conversation });

          // mark as read
          msg.read = true;
          await msg.save();
        }
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
    });

    // ---------------------------
    // SEND MESSAGE
    // ---------------------------
    socket.on("sendMessage", async ({ senderId, receiverId, text, conversationId }) => {
      if (!senderId || !text) return;

      try {
        let conversation;
        let isNew = false;

        if (conversationId) {
          conversation = await Conversation.findById(conversationId);
        } else {
          conversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
          });

          if (!conversation) {
            conversation = await Conversation.create({
              members: [senderId, receiverId],
              status: "pending",
              initiatedBy: senderId,
            });
            isNew = true;
          }
        }

        const actualReceiverId =
          conversation.members.find((id) => id.toString() !== senderId) ||
          receiverId;

        let message = await Message.create({
          conversationId: conversation._id,
          senderId,
          receiverId: actualReceiverId,
          text,
          read: false,
        });

        message = await Message.findById(message._id)
          .populate("senderId", "name avatar.url")
          .populate("receiverId", "name avatar.url");

        conversation.lastMessage = text;
        await conversation.save();

        conversation = await Conversation.findById(conversation._id)
          .populate("members", "name avatar.url");

        io.to(senderId.toString()).emit("newMessage", { message, conversation });
        io.to(actualReceiverId.toString()).emit("newMessage", { message, conversation });
        io.to(conversation._id.toString()).emit("newMessage", { message, conversation });

        // only once
        if (isNew && conversation.status === "pending") {
          io.to(actualReceiverId.toString()).emit("newRequest", { conversation });
        }
      } catch (err) {
        console.error("❌ sendMessage error:", err);
      }
    });

    // ---------------------------
    // ACCEPT CONVERSATION
    // ---------------------------
    socket.on("acceptConversation", async (conversationId) => {
      try {
        const conversation = await Conversation.findByIdAndUpdate(
          conversationId,
          { status: "accepted" },
          { new: true }
        ).populate("members", "name avatar.url");

        const messages = await Message.find({ conversationId })
          .sort({ createdAt: 1 })
          .populate("senderId", "name avatar.url")
          .populate("receiverId", "name avatar.url");

        await Message.updateMany(
          { conversationId, read: false },
          { $set: { read: true } }
        );

        conversation.members.forEach((m) => {
          io.to(m._id.toString()).emit("requestAccepted", {
            conversation,
            messages,
          });
        });
      } catch (err) {
        console.error("❌ acceptConversation error:", err);
      }
    });

    socket.on("rejectConversation", async (conversationId) => {
      const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { status: "rejected" },
        { new: true }
      );

      conversation.members.forEach((id) => {
        io.to(id.toString()).emit("requestRejected", { conversation });
      });
    });

    socket.on("disconnect", () => {
      console.log("⚡ Chat Socket disconnected:", socket.id);
    });
  });
};

export default initChatSocket;

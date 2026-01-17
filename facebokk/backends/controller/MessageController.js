import mongoose from "mongoose"; 

import Message from "../models/Messagemodel.js";
import Conversation from "../models/Conversationmodel.js";

// ---------------------------
// 1️⃣ Create or Get Chat (first message = pending request)
// ---------------------------
export const createOrGetChat = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user._id; // current logged-in user

  console.log("🔹 createOrGetChat called");
  console.log("SenderId:", senderId, "ReceiverId:", receiverId);

  if (!receiverId) {
    console.warn("❌ receiverId missing in request body");
    return res.status(400).json({ message: "receiverId required" });
  }

  try {
    const senderObjId = new mongoose.Types.ObjectId(senderId);
    const receiverObjId = new mongoose.Types.ObjectId(receiverId);

    // 1️⃣ Try to find existing conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderObjId, receiverObjId] },
    });

    console.log("🔍 Found conversation:", conversation);

    // 2️⃣ If conversation does NOT exist → create new pending
    if (!conversation) {
      console.log("🚀 No conversation found, creating new one");
      conversation = await Conversation.create({
        members: [senderObjId, receiverObjId],
        status: "pending",        // 🔹 pending first
        initiatedBy: senderId,    // 🔹 mark sender
      });
      console.log("✅ New conversation created (pending):", conversation._id);
    } else {
      console.log("ℹ️ Conversation already exists:", conversation._id);
    }

    // 3️⃣ Send conversation object to frontend
    console.log("📤 Sending conversation to frontend:", conversation._id);
    res.status(200).json(conversation);

  } catch (err) {
    console.error("🔥 createOrGetChat ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------------------
// SEND MESSAGE (FULLY UPDATED)
//
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text, conversationId } = req.body;

    if (!senderId || !text) {
      return res.status(400).json({ message: "senderId and text required" });
    }

    let conversation;

    // ==========================
    // 1️⃣ EXISTING CONVERSATION
    // ==========================
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
    } 
    // ==========================
    // 2️⃣ FIRST MESSAGE (NO CHAT)
    // ==========================
    else {
      if (!receiverId) {
        return res.status(400).json({ message: "receiverId required" });
      }

      conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          members: [senderId, receiverId],
          status: "pending",
          initiatedBy: senderId,
        });
      }
    }

    // ==========================
    // GET RECEIVER FROM CHAT
    // ==========================
    const actualReceiverId = conversation.members.find(
      (id) => id.toString() !== senderId
    );

    // ==========================
    // CREATE MESSAGE
    // ==========================
    let message = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId: actualReceiverId,
      text,
    });

    // 🔹 Populate senderId and receiverId (Mongoose >=6)
    message = await Message.findById(message._id)
      .populate("senderId", "name avatar.url")
      .populate("receiverId", "name avatar.url");

    // ==========================
    // UPDATE LAST MESSAGE
    // ==========================
    conversation.lastMessage = text;
    await conversation.save();

    // ==========================
    // SOCKET.IO EMIT
    // ==========================
    if (global.io) {
      conversation.members.forEach((userId) => {
        global.io.to(userId.toString()).emit("newMessage", {
          message,
          conversation,
        });
      });

      if (conversation.status === "pending") {
        global.io
          .to(actualReceiverId.toString())
          .emit("newRequest", { conversation });
      }
    }

    // ==========================
    // SEND RESPONSE
    // ==========================
    res.status(201).json({ message, conversation });
  } catch (err) {
    console.error("❌ SEND MESSAGE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// GET MESSAGES OF A CONVERSATION
// ---------------------------
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversationId" });
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Fetch messages
    const messages = await Message.find({ conversationId })
      .populate("senderId", "name avatar.url")
      .populate("receiverId", "name avatar.url")
      .sort({ createdAt: 1 })
      .lean(); // lean() gives plain JS objects for safer access

    // Optional: normalize sender/receiver if null
    const normalizedMessages = messages.map((msg) => ({
      ...msg,
      senderId: msg.senderId || { _id: null, name: "Unknown", avatar: { url: "/default-avatar.png" } },
      receiverId: msg.receiverId || { _id: null, name: "Unknown", avatar: { url: "/default-avatar.png" } },
    }));

    console.log(`📤 getMessages: ${normalizedMessages.length} messages for conversation ${conversationId}`);

    res.status(200).json({ messages: normalizedMessages });
  } catch (err) {
    console.error("❌ getMessages ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 4️⃣ Get user conversations (accepted only)
// ---------------------------
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({
      members: userId,
      status: "accepted",
    }).populate("members", "name avatar");
    res.status(200).json({ conversations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 5️⃣ Get pending requests
// ---------------------------
export const getPendingRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await Conversation.find({
      members: userId,
      status: "pending",
      initiatedBy: { $ne: userId },
    }).populate("members", "name avatar");
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 6️⃣ Accept conversation (move to inbox)
// ---------------------------
export const acceptConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    // Accept it
    conversation.status = "accepted";
    await conversation.save();

    // Fetch messages
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    // Socket emit
    if (global.io) {
      conversation.members.forEach(id => {
        global.io.to(id).emit("requestAccepted", { conversation, messages });
      });
    }

    res.status(200).json({ conversation, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// 7️⃣ Reject conversation
// ---------------------------
export const rejectConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { status: "rejected" },
      { new: true }
    );

    // Socket emit
    if (global.io && conversation) {
      conversation.members.forEach(id => {
        global.io.to(id).emit("requestRejected", { conversation });
      });
    }

    res.status(200).json({ message: "Request rejected", conversation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

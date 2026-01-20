import mongoose from "mongoose"; 
import User from "../models/userModel.js"; // सही path अपने project structure के अनुसार

import Message from "../models/Messagemodel.js";
import Conversation from "../models/Conversationmodel.js";
export const createOrGetChat = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;

  if (!receiverId) {
    return res.status(400).json({ message: "receiverId required" });
  }

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    })
      .populate("members", "name avatar lastSeen")
      .populate("lastMessage");

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
        status: "pending",
        initiatedBy: senderId,
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("members", "name avatar lastSeen")
        .populate("lastMessage");
    }

    res.status(200).json({
      conversation,
    });
  } catch (err) {
    console.error("🔥 createOrGetChat ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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

    // Fetch messages with populated sender & receiver info including lastSeen & isOnline
    const messages = await Message.find({ conversationId })
      .populate({
        path: "senderId",
        select: "name avatar.url lastSeen isOnline",
        model: User,
      })
      .populate({
        path: "receiverId",
        select: "name avatar.url lastSeen isOnline",
        model: User,
      })
      .sort({ createdAt: 1 })
      .lean(); // lean() gives plain JS objects

    // Normalize sender/receiver if null
    const normalizedMessages = messages.map((msg) => ({
      ...msg,
      senderId:
        msg.senderId || {
          _id: null,
          name: "Unknown",
          avatar: { url: "/default-avatar.png" },
          isOnline: false,
          lastSeen: null,
        },
      receiverId:
        msg.receiverId || {
          _id: null,
          name: "Unknown",
          avatar: { url: "/default-avatar.png" },
          isOnline: false,
          lastSeen: null,
        },
    }));

    console.log(
      `📤 getMessages: ${normalizedMessages.length} messages for conversation ${conversationId}`
    );

    res.status(200).json({ messages: normalizedMessages });
  } catch (err) {
    console.error("❌ getMessages ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text, conversationId } = req.body;

    if (!senderId || !text) {
      return res.status(400).json({ message: "senderId and text required" });
    }

    let conversation;

    // -------------------- GET OR CREATE CONVERSATION --------------------
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) return res.status(404).json({ message: "Conversation not found" });
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
      }
    }

    // -------------------- DETERMINE ACTUAL RECEIVER --------------------
    const actualReceiverId =
      receiverId || conversation.members.find((id) => id.toString() !== senderId);

    // -------------------- CREATE MESSAGE --------------------
    let message = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId: actualReceiverId,
      text,
    });

    // Optional: populate sender & receiver info
    message = await Message.findById(message._id)
      .populate("senderId", "name avatar.url")
      .populate("receiverId", "name avatar.url");

    // -------------------- UPDATE LAST MESSAGE --------------------
    conversation.lastMessage = text;
    await conversation.save();

    // -------------------- SOCKET EMIT TO RECEIVER --------------------
    if (global.io && actualReceiverId) {
      global.io.to(actualReceiverId.toString()).emit("newMessage", { message, conversation });
      console.log(`📤 Emitted newMessage to receiver ${actualReceiverId}`);
    }

    // -------------------- RESPONSE --------------------
    res.status(201).json({ message, conversation });

  } catch (err) {
    console.error("❌ SEND MESSAGE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Fetch accepted conversations
    const conversations = await Conversation.find({
      members: userId,
      status: "accepted",
    }).populate({
      path: "members",
      select: "name avatar isOnline lastSeen",
    });

    res.status(200).json({ conversations });
  } catch (err) {
    console.error("❌ getUserConversations error:", err);
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
// ACCEPT CONVERSATION
// ---------------------------
export const acceptConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    conversation.status = "accepted";
    await conversation.save();

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.status(200).json({ conversation, messages });
  } catch (err) {
    console.error("❌ ACCEPT CONVERSATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// REJECT CONVERSATION
// ---------------------------
export const rejectConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { status: "rejected" },
      { new: true }
    );

    res.status(200).json({ message: "Request rejected", conversation });
  } catch (err) {
    console.error("❌ REJECT CONVERSATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


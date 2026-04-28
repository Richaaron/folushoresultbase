const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Message = require("../models/Message");
const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");

// Send message from admin to teacher
router.post(
  "/send",
  auth,
  authorize(["ADMIN"]),
  asyncHandler(async (req, res) => {
    const { recipientId, subject, content, messageType } = req.body;

    // Verify recipient is a teacher
    const recipient = await User.findByPk(recipientId);
    if (!recipient || recipient.role !== "TEACHER") {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const message = await Message.create({
      senderId: req.user.id,
      recipientId,
      subject,
      content,
      messageType: messageType || "GENERAL",
    });

    logger.info(`Message sent from admin to teacher: ${recipientId}`);

    res.status(201).json({ message, success: true });
  })
);

// Get messages for a teacher (both sent to them and by them)
router.get(
  "/teacher/:teacherId",
  auth,
  authorize(["ADMIN", "TEACHER"]),
  asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Verify authorization
    if (req.user.role === "TEACHER" && req.user.id !== parseInt(teacherId)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const messages = await Message.findAndCountAll({
      where: {
        [require("sequelize").Op.or]: [
          { senderId: parseInt(teacherId) },
          { recipientId: parseInt(teacherId) },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["id", "fullName", "role"] },
        {
          model: User,
          as: "recipient",
          attributes: ["id", "fullName", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json(messages);
  })
);

// Mark message as read
router.put(
  "/:messageId/read",
  auth,
  asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Verify user is the recipient
    if (message.recipientId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await message.update({ isRead: true });
    res.json({ message, success: true });
  })
);

// Get unread message count for a user
router.get(
  "/unread/count",
  auth,
  asyncHandler(async (req, res) => {
    const unreadCount = await Message.count({
      where: {
        recipientId: req.user.id,
        isRead: false,
      },
    });

    res.json({ unreadCount });
  })
);

// Get all messages for admin dashboard
router.get(
  "/",
  auth,
  authorize(["ADMIN"]),
  asyncHandler(async (req, res) => {
    const { limit = 50, offset = 0, teacherId = null } = req.query;
    const where = {};

    if (teacherId) {
      where[require("sequelize").Op.or] = [
        { senderId: parseInt(teacherId) },
        { recipientId: parseInt(teacherId) },
      ];
    }

    const messages = await Message.findAndCountAll({
      where,
      include: [
        { model: User, as: "sender", attributes: ["id", "fullName", "role"] },
        {
          model: User,
          as: "recipient",
          attributes: ["id", "fullName", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json(messages);
  })
);

module.exports = router;

const express = require("express");
const Notification = require("../models/Notification");
const User = require("../models/User");  // Import User model
const router = express.Router();

// Utility to fetch user by UID
const getUserByUID = async (uid) => {
  const user = await User.findOne({ uid });
  if (!user) throw new Error("User not found");
  return user;
};

// GET /api/notifications/:userId
router.get("/:userId", async (req, res) => {
  const { status } = req.query;  // Get the status filter from query parameters

  try {
    const user = await getUserByUID(req.params.userId);

    // Filter based on 'unread' or 'all'
    const filter = status === "unread" ? { recipient: user._id, read: false } : { recipient: user._id };
    
    const notifs = await Notification.find(filter).sort({ createdAt: -1 });
    
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Update the read status to true
    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notifications/:userId/read-all
router.put("/:userId/read-all", async (req, res) => {
  try {
    const user = await getUserByUID(req.params.userId);
    await Notification.updateMany({ recipient: user._id, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

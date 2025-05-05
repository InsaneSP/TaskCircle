const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const notifs = await Notification.find({ recipient: req.params.userId }).sort({ createdAt: -1 });
  res.json(notifs);
});

router.put("/:id/read", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: "Marked as read" });
});

module.exports = router;

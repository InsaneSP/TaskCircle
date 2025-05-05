const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: String,
  read: { type: Boolean, default: false },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "user" },
  department: { type: String },
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  createdTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
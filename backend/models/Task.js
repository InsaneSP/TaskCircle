const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // optional
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // optional
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // required!
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

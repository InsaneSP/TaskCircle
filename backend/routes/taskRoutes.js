const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const Notification = require("../models/Notification");

const router = express.Router();

// Utility to fetch user by UID
const getUserByUID = async (uid) => {
  const user = await User.findOne({ uid });
  if (!user) throw new Error("User not found");
  return user;
};

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      assignedBy,
      createdBy,
    } = req.body;

    if (!title || !dueDate || !createdBy) {
      return res.status(400).json({ error: "Title, Due Date, and Created By are required." });
    }

    const creator = await getUserByUID(createdBy);

    let assignee = null;
    if (assignedTo) {
      assignee = await getUserByUID(assignedTo);
    }

    let assigner = null;
    if (assignedBy) {
      assigner = await getUserByUID(assignedBy);
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo: assignee ? assignee._id : null,
      assignedBy: assigner ? assigner._id : null,
      createdBy: creator._id,
    });

    if (assignee) {
      await Notification.create({
        recipient: assignee._id,
        task: task._id,
        message: `You have been assigned to '${task.title}'`,
      });

      await User.findByIdAndUpdate(assignee._id, {
        $addToSet: { assignedTasks: task._id },
      });
    }

    res.status(201).json(task);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate([
      { path: "assignedTo", select: "name email uid" },
      { path: "createdBy", select: "name email uid" },
      { path: "assignedBy", select: "name email uid" }
    ]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/assigned/:uid', async (req, res) => {
  try {
    const user = await getUserByUID(req.params.uid);
    const tasks = await Task.find({ assignedTo: user._id }).populate([
      { path: "assignedTo", select: "name email uid" },
      { path: "createdBy", select: "name email uid" },
      { path: "assignedBy", select: "name email uid" }
    ]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/created/:uid', async (req, res) => {
  try {
    const user = await getUserByUID(req.params.uid);
    const tasks = await Task.find({ createdBy: user._id }).populate([
      { path: "assignedTo", select: "name email uid" },
      { path: "createdBy", select: "name email uid" },
      { path: "assignedBy", select: "name email uid" }
    ]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate([
      { path: "assignedTo", select: "name email uid" },
      { path: "createdBy", select: "name email uid" },
      { path: "assignedBy", select: "name email uid" }
    ]);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Resolve assignedTo only if it's provided
    if (req.body.hasOwnProperty("assignedTo") && req.body.assignedTo) {
      const assignee = await getUserByUID(req.body.assignedTo);
      updateData.assignedTo = assignee._id;

      await Notification.create({
        recipient: assignee._id,
        task: req.params.id,
        message: `You have been assigned to '${req.body.title || 'a task'}'`,
      });

      await User.findByIdAndUpdate(assignee._id, {
        $addToSet: { assignedTasks: req.params.id },
      });
    }

    // Resolve assignedBy only if provided
    if (req.body.hasOwnProperty("assignedBy") && req.body.assignedBy) {
      const assigner = await getUserByUID(req.body.assignedBy);
      updateData.assignedBy = assigner._id;
    }

    // Resolve createdBy only if provided
    if (req.body.hasOwnProperty("createdBy") && req.body.createdBy) {
      const creator = await getUserByUID(req.body.createdBy);
      updateData.createdBy = creator._id;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate([
      { path: "assignedTo", select: "name email uid" },
      { path: "createdBy", select: "name email uid" },
      { path: "assignedBy", select: "name email uid" }
    ]);

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found or update failed." });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error during task update:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

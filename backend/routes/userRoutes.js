const express = require('express');
const router = express.Router();
const { registerOrLogin } = require('../controllers/userController');
const User = require('../models/User');

router.post('/auth', registerOrLogin);

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "_id name email uid");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update-profile/:uid', async (req, res) => {
  const { uid } = req.params;
  const updatedData = req.body;

  console.log("Updating user:", uid);
  console.log("Data received:", updatedData);

  try {
    const updatedUser = await User.findOneAndUpdate({ uid }, updatedData, { new: true });

    if (!updatedUser) {
      console.log("No user found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update profile", error });
  }
});


// GET USER PROFILE
router.get('/profile/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", err });
  }
});

module.exports = router;

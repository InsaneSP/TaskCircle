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

router.put('/update', async (req, res) => {
  const { uid, name, about, phone } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { name, about, phone },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});


module.exports = router;

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


module.exports = router;

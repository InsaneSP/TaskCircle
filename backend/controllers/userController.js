const User = require('../models/User');

const registerOrLogin = async (req, res) => {
  const { uid, name, email } = req.body;

  if (!uid || !email || !name) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        name,
        email,
        role: "user",
        department: "",
        about: "",
        phone: "",
        location: "",
        dob: null,
        assignedTasks: [],
        createdTasks: [],
      });

      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in registerOrLogin:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerOrLogin };
const User = require('../models/User');

const registerOrLogin = async (req, res) => {
  console.log("Incoming request body:", req.body);

  const { uid, name, email } = req.body;

  if (!uid || !email || !name) {
    console.log("Missing fields:", { uid, name, email });
    return res.status(400).json({ message: "Missing fields" });
  }

  const userName = name || "Default Name";

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      console.log("Creating new user...");
      user = new User({ uid, name: userName, email });
      await user.save();
      console.log("User saved:", user);
    } else {
      console.log("User already exists:", user);
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in registerOrLogin:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerOrLogin };

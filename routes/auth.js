const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = user.genAuthToken();
  res.json({ token });
});

module.exports = router;

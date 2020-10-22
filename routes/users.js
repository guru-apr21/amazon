const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/signup", async (req, res) => {
  const duplicate = await User.findOne({ email: req.body.email });
  if (duplicate) return res.status(400).json({ error: "User already exists" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

  const { firstName, lastName, email, admin } = req.body;

  const user = new User({
    firstName,
    lastName,
    email,
    passwordHash,
    admin,
  });

  await user.save();
  const token = user.genAuthToken();
  res.json({ token });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = user.genAuthToken();
  res.json({ token });
});

module.exports = router;

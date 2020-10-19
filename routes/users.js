const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const duplicate = await User.findOne({ email: req.body.email });
  if (duplicate) return res.status(400).json({ error: "User already exists" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

  const { firstName, lastName, email } = req.body;

  const user = new User({
    firstName,
    lastName,
    email,
    passwordHash,
  });

  await user.save();
  const token = user.genAuthToken();
  res.json({ token });
});

module.exports = router;

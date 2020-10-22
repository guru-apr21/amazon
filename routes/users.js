const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const {
  findUserByEmailId,
  createUser,
  comparePassword,
} = require("../controllers/users");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/signup", async (req, res) => {
  const duplicate = await findUserByEmailId(req.body.email);
  if (duplicate) return res.status(400).json({ error: "User already exists" });

  const token = await createUser(req.body);
  res.json({ token });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmailId(email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await comparePassword(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = user.genAuthToken();
  res.json({ token });
});

module.exports = router;

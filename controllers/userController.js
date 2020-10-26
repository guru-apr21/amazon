const User = require("../models/User");
const { hashPassword, comparePassword } = require("../services/bcrypt");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const findUserByEmailId = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const createUser = async (req, res) => {
  const { password, firstName, lastName, email, admin } = req.body;

  const duplicate = await User.findOne({ email });
  if (duplicate) return res.status(400).json({ error: "User already exists" });

  const passwordHash = await hashPassword(password);
  const user = new User({ passwordHash, firstName, lastName, email, admin });
  await user.save();
  const token = user.genAuthToken();
  res.json({ token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmailId(email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await comparePassword(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = user.genAuthToken();
  res.json({ token });
};

const changePassword = async (req, res) => {
  const { email, _id: userId } = req.user;
  let { password, newPassword } = req.body;
  let user = await findUserByEmailId(email);
  if (!user) return res.status(404).json("User not found");

  const match = await comparePassword(password, user.passwordHash);
  if (!match) return res.status(400).json("Invalid Credentials");

  newPassword = await hashPassword(password);

  user = await User.findByIdAndUpdate(userId, { passwordHash: newPassword });
  res.status(200).send("Changed password successfully!");
};

module.exports = {
  findUserByEmailId,
  createUser,
  findUserById,
  getAllUsers,
  loginUser,
  changePassword,
};

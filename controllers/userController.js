const User = require("../models/User");
const { hashPassword } = require("../services/bcrypt");

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const findUserByEmailId = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const createUser = async (reqbody) => {
  const { password, firstName, lastName, email, admin } = reqbody;
  const passwordHash = await hashPassword(password);
  const user = new User({ passwordHash, firstName, lastName, email, admin });
  await user.save();
  const token = user.genAuthToken();
  return token;
};

module.exports = {
  findUserByEmailId,
  createUser,
  findUserById,
  getAllUsers,
};

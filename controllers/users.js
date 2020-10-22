const User = require("../models/Users");
const bcrypt = require("bcrypt");

const findUserByEmailId = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const createUser = async (reqbody) => {
  const { password, firstName, lastName, email, admin } = reqbody;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({ passwordHash, firstName, lastName, email, admin });
  await user.save();
  const token = user.genAuthToken();
  return token;
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { findUserByEmailId, createUser, comparePassword };

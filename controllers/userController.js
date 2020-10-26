const User = require("../models/User");
const { hashPassword, comparePassword } = require("../services/bcrypt");

/**
 *
 * @param  req
 * @param  res
 *
 * @returns {Array} users array
 */
const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

/**
 *
 * @param {String} email
 * @returns {Object} user object
 */
const findUserByEmailId = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

/**
 *
 * @param  Objectid
 * @returns user Object
 */
const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

/**
 *
 * @param {String} req.body.password
 * @param {String} req.body.firstName
 * @param {String} req.body.lastName
 * @param {String} req.body.email
 * @param {Boolean} req.body.admin
 * @param res
 *
 * @returns status 400 if user exists
 * @returns jwt token with user info payload
 *
 * Register user in the database
 */
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

/**
 *
 * @param {String} req.body.email
 * @param {String} req.body.password
 * @param res
 *
 * @returns status 400 if Invalid credentials
 * @returns jwt token with user payload
 *
 * Login exisiting user in the database
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmailId(email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await comparePassword(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = user.genAuthToken();
  res.json({ token });
};

/**
 *
 * @param {String} req.body.password
 * @param {String} req.body.newPassword
 * @param res
 *
 * @returns status 404 if user not found
 * @returns status 400 If credentials is invalid
 * @returns status 200 if password change is successfull
 *
 * Change password for an existing user if credentials is correct
 */
const changePassword = async (req, res) => {
  const { email } = req.user;
  let { password, newPassword } = req.body;
  let user = await findUserByEmailId(email);
  if (!user) return res.status(404).json("User not found");

  const match = await comparePassword(password, user.passwordHash);
  if (!match) return res.status(400).json("Invalid Credentials");

  newPassword = await hashPassword(newPassword);
  user.passwordHash = newPassword;
  await user.save();
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

/**
 * @params {header: JWT 'token'}
 * @params req.body.product.name - required
 * @params req.body.product.type
 *
 * @params req.body.plan.nickName
 * @params req.body.plan.amount
 * @params req.body.plan.currency must be supported format e.g ('inr', 'usd')
 * @params req.body.plan.interval  Either day, week, month or year.
 * @params req.body.plan.usage_type [licensed, metered]
 *
 * @returns {StripePlan}
 */

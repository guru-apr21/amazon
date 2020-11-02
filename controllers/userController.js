const User = require("../models/User");
const { hashPassword, comparePassword } = require("../services/bcrypt");
const Stripe = require("stripe");
const Address = require("../models/Address");
const stripe = Stripe(
  "sk_test_51HhUbGDRaW3L2zxrOz9d8TOvQRpmQxM489GvgsN0IXlKJS4lN5LK4YUn3INZ2wWeQfwtwZAjKuT5sJHXnqJn5NDj00XE57kVEF"
);

/**
 *
 * @param  req
 * @param  res
 *
 * @returns {Array} users array
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

/**
 *
 * @param {String} email
 * @returns {Object} user object
 */
const findUserByEmailId = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
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
 * Creates stripe customer obj with name and email address and stores them in database
 * Register user in the database
 */
const createUser = async (req, res, next) => {
  try {
    const { password, firstName, lastName, email, admin } = req.body;

    const duplicate = await User.findOne({ email });
    if (duplicate)
      return res.status(400).json({ error: "User already exists" });

    const passwordHash = await hashPassword(password);

    const name = `${firstName} ${lastName}`;
    const customer = await stripe.customers.create({
      email,
      name,
    });
    const user = new User({
      passwordHash,
      firstName,
      lastName,
      email,
      admin,
      stripeCustomerId: customer.id,
    });
    await user.save();
    const token = user.genAuthToken();
    res.json({ token });
  } catch (error) {
    next(error);
  }
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
  try {
    const { email, password } = req.body;

    const user = await findUserByEmailId(email);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await comparePassword(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = user.genAuthToken();
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
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
const changePassword = async (req, res, next) => {
  try {
    const { email } = req.user;
    let { password, newPassword } = req.body;
    let user = await findUserByEmailId(email);
    if (!user) return res.status(404).json("User not found");

    const match = await comparePassword(password, user.passwordHash);
    if (!match) return res.status(204).json("Invalid Credentials");
    newPassword = await hashPassword(newPassword);
    user.passwordHash = newPassword;
    await user.save();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    if (!addresses)
      return res.status(404).json("No address with the given id.");
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

const createNewAddress = async (req, res, next) => {
  try {
    const { city, country, line1, line2, postal_code, state } = req.body;
    let address = new Address({
      user: req.user._id,
      city,
      country,
      line1,
      line2,
      postal_code,
      state,
    });

    address = await address.save();
    return res.json(address);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findUserByEmailId,
  createUser,
  findUserById,
  getAllUsers,
  loginUser,
  changePassword,
  getUserAddresses,
  createNewAddress,
};

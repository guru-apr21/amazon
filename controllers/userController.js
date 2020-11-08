const User = require('../models/User');
const { hashPassword, comparePassword } = require('../services/bcrypt');
const { stripe } = require('../utils/config');
const { uploadToS3, S3 } = require('../services/file_upload');

/**
 *
 * @param  req
 * @param  res
 *
 * @returns {Array} users array
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
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
 * Creates stripe customer obj with name and email address and stores them in database
 * Register user in the database
 */
const createUser = async (req, res, next) => {
  try {
    const { password, firstName, lastName, email, role } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await hashPassword(password);

    const name = `${firstName} ${lastName}`;
    const customer = await stripe.customers.create({
      email,
      name,
    });

    const newUser = new User({
      passwordHash,
      firstName,
      lastName,
      email,
      role: role || 'buyer',
      stripeCustomerId: customer.id,
    });
    const accessToken = newUser.genAuthToken();
    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({ data: newUser, accessToken });
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
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmailId(email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await comparePassword(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const accessToken = user.genAuthToken();
    await User.findByIdAndUpdate(user._id, { accessToken });
    res.json({ data: { email: user.email, role: user.role }, accessToken });
  } catch (error) {
    next(error);
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
    const password = { req };
    let { newPassword } = req.body;
    const user = await findUserByEmailId(email);
    if (!user) return res.status(404).json('User not found');

    const match = await comparePassword(password, user.passwordHash);
    if (!match) return res.status(400).json('Invalid Credentials');
    newPassword = await hashPassword(newPassword);
    user.passwordHash = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully!' });
  } catch (error) {
    next(error);
  }
};

// Used to upload and change the avatar picture
const uploadAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.status(404).json({ error: 'No user with the given id' });
    }
    user.avatar = await uploadToS3(req.file, 'userAvatars');
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

// Used to delete a avatar picture
const deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.status(404).json({ error: 'No user with the given id' });
    }
    await S3.deleteObject({
      Bucket: 'guru-s3demo',
      Key: `userAvatars/${req.user._id}.JPG`,
    }).promise();
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { avatar: 1 } },
      { new: true }
    );
    return res.status(204).end();
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
  uploadAvatar,
  deleteAvatar,
};

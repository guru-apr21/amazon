const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { jwtPrivateKey } = require('../utils/config');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  stripeCustomerId: { type: String, required: true },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'superAdmin'],
    default: 'buyer',
  },
  accessToken: String,
  avatar: String,
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.passwordHash;
    delete returnedObject.__v;
  },
});

userSchema.methods.genAuthToken = function jwtSign() {
  return jwt.sign(
    {
      userId: this._id,
    },
    jwtPrivateKey,
    {
      expiresIn: '1d',
    }
  );
};

const validateSignUp = (value) => {
  const schema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: joi.string().required(),
    role: joi.string().valid('buyer', 'seller', 'superAdmin'),
  });
  return schema.validate(value);
};

const validateSignIn = (value) => {
  const schema = joi.object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: joi.string().required(),
  });
  return schema.validate(value);
};

const validateChangePwd = (value) => {
  const schema = joi.object({
    password: joi.string().required(),
    newPassword: joi.string().required(),
  });
  return schema.validate(value);
};

const User = mongoose.model('User', userSchema);
module.exports = { User, validateSignUp, validateSignIn, validateChangePwd };

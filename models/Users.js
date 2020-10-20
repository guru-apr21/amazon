require("dotenv").config();
const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "Buyer" },
});

userSchema.methods.genAuthToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.jwtPrivateKey,
    {
      expiresIn: 100000,
    }
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;

const { jwtPrivateKey } = require("../utils/config");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  stripeCustomerId: { type: String, required: true },
  role: {
    type: String,
    enum: ["buyer", "seller", "superAdmin"],
    default: "buyer",
  },
  accessToken: String,
  avatar: String,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.passwordHash;
    delete returnedObject.__v;
  },
});

userSchema.methods.genAuthToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    jwtPrivateKey,
    {
      expiresIn: "1d",
    }
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;

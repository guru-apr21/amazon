const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

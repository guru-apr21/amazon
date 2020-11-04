const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: String, required: true, unique: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  images: [{ type: String }],
});

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  line1: { type: String, required: true },
  line2: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
});

shippingSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

const Address = mongoose.model("Address", shippingSchema);
module.exports = Address;

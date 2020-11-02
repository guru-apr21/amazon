const mongoose = require("mongoose");

const orderItemSchema = {
  quantity: { type: Number, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
};

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // orderItems: [orderItemSchema],
    shipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    stripePaymentId: String,
    itemsPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    paidAt: { type: Date, default: Date.now() },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

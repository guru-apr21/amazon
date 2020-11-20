const mongoose = require('mongoose');
const { productSchema } = require('./Product');

const orderItemSchema = {
  quantity: { type: Number, required: true },
  productId: productSchema,
};

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    stripePaymentIntentId: String,
    itemsPrice: Number,
    shippingPrice: Number,
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    status: { type: String, enum: ['placed', 'approved', 'delivered'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

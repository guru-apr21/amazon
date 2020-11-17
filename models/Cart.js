const mongoose = require('mongoose');

// const productSchema = {
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//   quantity: { type: Number, default: 1 },
//   price: Number,
//   title: 'String',
// };

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: Number,
        title: 'String',
      },
    ],
    active: { type: Boolean, default: true },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);

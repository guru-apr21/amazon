const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, max: 5, default: 0, required: true },
  review: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

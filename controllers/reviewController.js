const Product = require("../models/Product");
const Review = require("../models/Review");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate("user").populate("product");
  res.json(reviews);
};

const postReview = async (req, res) => {
  const user = req.user._id;
  const { product, rating, review } = req.body;

  const userReview = await Review.findOne({ user, product })
    .populate("user")
    .populate("product");

  if (userReview) {
    userReview.rating = rating;
    userReview.review = review;

    await userReview.save();
    return res.status(200).json(userReview);
  } else {
    const newReview = new Review({ user, product, rating, review });

    const reviewedProduct = await Product.findById(product);
    reviewedProduct.reviews = [...reviewedProduct.reviews, newReview._id];
    await reviewedProduct.save();

    await newReview.save();
    await newReview.populate("user").populate("product").execPopulate();
    res.json({ message: "Review posted successfully!", data: newReview });
  }
};

const deleteReview = async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;

  const review = await Review.findById(id);
  if (!review) return res.status(404).json("No review with the given id");

  if (String(review.user) !== user) return res.status(403).end();

  const reviewedProduct = await Product.findById(review.product);
  reviewedProduct.reviews = reviewedProduct.reviews.filter(
    (rev) => String(rev) !== id
  );
  await reviewedProduct.save();

  await Review.deleteOne({ _id: id });
  res.status(201).json("Review deleted successfully!");
};

module.exports = { getAllReviews, postReview, deleteReview };

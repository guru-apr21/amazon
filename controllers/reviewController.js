const Product = require("../models/Product");
const Review = require("../models/Review");

/**
 *
 * @param  req
 * @param  res
 *
 * @returns {Array} reviews array
 *
 * Query the db and retuns array of review objects
 * with user and product fiels populated
 *
 */
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate("user").populate("product");
  res.json(reviews);
};

/**
 *
 * @param {ObjectID} req.user._id
 * @param {ObjectID} req.body.product
 * @param {Number} req.body.rating
 * @param {String} req.body.review
 *
 * @return {Object} review object if review exists for a given product by
 * the user after updating the new rating and review
 * @return {Object} New review object with user and product field populated
 *
 * Also updates the reviews array in product documents
 */
const postReview = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

/**
 *
 * @param {Object} req.params.id
 * @param {ObjectID} req.user._id
 * @param {*} res
 *
 * @returns status 404 if user not found
 * @returns status 403 if other users try to delete the review
 * @returns status 201 with success message
 *
 * Also updates the reviews array in product documents
 */
const deleteReview = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

module.exports = { getAllReviews, postReview, deleteReview };

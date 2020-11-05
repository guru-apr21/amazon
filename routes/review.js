const express = require("express");
const router = express.Router();
const { reviewController } = require("../controllers/main");
const { allowIfLoggedIn } = require("../middleware/auth");

/**
 * Respond with all reviews with
 * users and products fields populated
 */
router.get("/", allowIfLoggedIn, reviewController.getAllReviews);

/**
 * Create a new review for a product if there is none or
 * Update the existing review and rating
 */
router.post("/", allowIfLoggedIn, reviewController.postReview);

/**
 * Delete a review from the collections
 * Update the Product's reviews array
 */
router.delete("/:id", allowIfLoggedIn, reviewController.deleteReview);

module.exports = router;

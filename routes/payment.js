const router = require("express").Router();
const { paymentController } = require("../controllers/main");
const { allowIfLoggedIn } = require("../middleware/auth");

//Create new payment method
router.post(
  "/payment-method",
  allowIfLoggedIn,
  paymentController.createNewPaymentMethod
);

//Get all payment methods for a given stripe customer id
router.get(
  "/payment-method",
  allowIfLoggedIn,
  paymentController.getAllCardPaymentMethods
);

//Create a new payment intent
router.post(
  "/payment-intent",
  allowIfLoggedIn,
  paymentController.createPaymentIntent
);

//Confirm a payment intent by adding payment method
router.post("/pay", allowIfLoggedIn, paymentController.confirmPaymentIntent);

module.exports = router;

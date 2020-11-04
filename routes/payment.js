const router = require("express").Router();
const authenticateJwt = require("../middleware/auth");
const { paymentController } = require("../controllers/main");

//Create new payment method
router.post(
  "/payment-method",
  authenticateJwt,
  paymentController.createNewPaymentMethod
);

//Get all payment methods for a given stripe customer id
router.get(
  "/payment-method",
  authenticateJwt,
  paymentController.getAllCardPaymentMethods
);

//Create a new payment intent
router.post(
  "/payment-intent",
  authenticateJwt,
  paymentController.createPaymentIntent
);

//Confirm a payment intent by adding payment method
router.post("/pay", authenticateJwt, paymentController.confirmPaymentIntent);

module.exports = router;

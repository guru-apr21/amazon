const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51HhUbGDRaW3L2zxrOz9d8TOvQRpmQxM489GvgsN0IXlKJS4lN5LK4YUn3INZ2wWeQfwtwZAjKuT5sJHXnqJn5NDj00XE57kVEF"
);
const router = require("express").Router();
const authenticateJwt = require("../middleware/auth");
const Order = require("../models/Order");
const Address = require("../models/Address");
const { paymentController } = require("../controllers/main");

//Get card details of the customer
router.get("/card", authenticateJwt, async (req, res) => {
  let customer = req.user.stripeCustomerId;
  customer = await stripe.customers.retrieve(customer);
  console.log(customer);
  res.end();
});

router.post("/payment-method", authenticateJwt, async (req, res, next) => {
  try {
    const { cardDetails } = req.body;
    let paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: cardDetails,
    });
    res.json({ payment_method_id: paymentMethod.id });
  } catch (error) {
    next(error);
  }
});

router.get("/payment-method", authenticateJwt, async (req, res, next) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: "card",
    });
    res.json(paymentMethods);
  } catch (error) {
    next(error);
  }
});

//Create a new payment intent
router.post(
  "/payment-intent",
  authenticateJwt,
  paymentController.createPaymentIntent
);

//Confirm a payment intent by adding payment method
router.post("/pay", authenticateJwt, paymentController.confirmPaymentIntent);

module.exports = router;

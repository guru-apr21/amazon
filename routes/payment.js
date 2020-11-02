const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51HhUbGDRaW3L2zxrOz9d8TOvQRpmQxM489GvgsN0IXlKJS4lN5LK4YUn3INZ2wWeQfwtwZAjKuT5sJHXnqJn5NDj00XE57kVEF"
);
const router = require("express").Router();
const authenticateJwt = require("../middleware/auth");

//Get card details of the customer
router.post("/card", authenticateJwt, async (req, res) => {
  const { customer } = req.user;
  await stripe.customers.listSources(customer, { object: "card" });
});

module.exports = router;

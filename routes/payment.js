const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const stripe = require("stripe")(
  "sk_test_51HhUbGDRaW3L2zxrOz9d8TOvQRpmQxM489GvgsN0IXlKJS4lN5LK4YUn3INZ2wWeQfwtwZAjKuT5sJHXnqJn5NDj00XE57kVEF"
);

router.get("/customer", authenticateJwt, async (req, res, next) => {
  try {
    const customer = await stripe.customers.retrieve(req.user.customer);
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

router.put("/customer", authenticateJwt, async (req, res, next) => {
  try {
    const customer = await stripe.customers.update(req.user.customer, req.body);
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

router.post("/customer/card", authenticateJwt, async (req, res, next) => {
  try {
    let { customer } = req.user;
    const { cardDetails } = req.body;
    const token = await stripe.tokens.create({ card: cardDetails });
    const card = await stripe.customers.createSource(customer, {
      source: token.id,
    });
    customer = await stripe.customers.retrieve(customer);
    console.log(customer);
    res.json(card);
  } catch (error) {
    next(error);
  }
});

router.get("/customer/card", authenticateJwt, async (req, res, next) => {
  try {
    let { customer } = req.user;
    const cards = await stripe.customers.listSources(customer, {
      object: "card",
      limit: 3,
    });
    console.log(cards);
    res.json(cards);
  } catch (error) {
    next(error);
  }
});

router.get("/customer/charge", authenticateJwt, async (req, res, next) => {
  try {
    const charges = await stripe.charges.list({
      limit: 3,
      customer: req.user.customer,
    });
    res.send(charges);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

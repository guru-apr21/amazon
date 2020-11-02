const Order = require("../models/Order");

const createPaymentIntent = async (req, res, next) => {
  try {
    const customer = req.user.stripeCustomerId;
    const intent = await stripe.paymentIntents.create({
      amount: 100000,
      currency: "inr",
      confirmation_method: "manual",
      description: "Software development services",
      setup_future_usage: "off_session",
      customer,
    });
    if (intent.status === "requires_payment_method")
      return res.json({ payment_intent_id: intent.id });
  } catch (error) {
    next(error);
  }
};

const confirmPaymentIntent = async (req, res, next) => {
  try {
    let { address, payment_method, payment_intent_id } = req.body;

    let intent = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method,
    });

    if (intent.status === "succeeded") {
      let order = new Order({
        totalPrice: 100000,
        user: req.user._id,
        stripePaymentId: intent.id,
        shipping: address,
      });
      order = await order.save();
      await order.populate("shipping").execPopulate();
      return res.json({ success: true, order });
    } else if (intent.status === "requires_action") {
      return res.json({
        payment_intent_id: intent.id,
        message: "Requires action",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createPaymentIntent, confirmPaymentIntent };

const Order = require("../models/Order");
const Product = require("../models/Product");
const { stripe } = require("../utils/config");

/**
 *
 * @param {Array} req.body.orderItems
 * @param {*} res
 * @param {*} next
 *
 * Create a new stripe payment intent without a paymentmethod and
 * a new order document with isPaid set to false
 *
 * @returns {String} payment_intent_id
 * @returns {Object} order document
 */

const createPaymentIntent = async (req, res, next) => {
  try {
    const customer = req.user.stripeCustomerId;
    const { orderItems } = req.body;

    const productIds = orderItems.map((p) => p.productId);
    const products = await Product.find()
      .where("_id")
      .in(productIds)
      .select("price")
      .exec();

    let amount = 0;

    console.log(typeof products[0]._id, typeof productIds[0]);
    for (let i = 0; i < products.length; i++) {
      if (productIds[i] === String(products[i]._id)) {
        amount += orderItems[i].quantity * products[i].price;
      }
    }

    //Create new payment intent
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      confirmation_method: "manual",
      description: "Software development services",
      setup_future_usage: "off_session",
      customer,
    });

    //Create new order document and save it to DB with isPaid set to false
    let order = new Order({
      orderItems,
      user: req.user._id,
      totalPrice: amount,
      user: req.user._id,
      stripePaymentIntentId: intent.id,
    });
    order = await order.save();

    if (intent.status === "requires_payment_method")
      return res.json({ payment_intent_id: intent.id, order });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {ObjectID} req.body.address
 * @param {String} req.body.payment_method
 * @param {String} req.body.payment_intent_id
 * @param {ObjectID} req.body.orderId
 * @param {*} res
 * @param {*} next
 *
 * Add payment method to the payment intent and confirms the order
 * @returns {Object} order document with isPaid set to true
 *
 * if the payment requires bank authentication is sent to the client
 * with payment intent id
 *
 * @returns {String} payment_intent_id
 */
const confirmPaymentIntent = async (req, res, next) => {
  try {
    let { address, payment_method, payment_intent_id, orderId } = req.body;

    let intent = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method,
    });

    if (intent.status === "succeeded") {
      let order = await Order.findByIdAndUpdate(orderId, {
        shipping: address,
        isPaid: true,
        paidAt: Date.now(),
      });

      order = await order.populate("shipping").execPopulate();
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

/**
 *
 * @param {*} req.body.cardDetails
 * @param {*} res
 * @param {*} next
 *
 * Creates a new card payment method
 *
 * @returns {String} payment_method_id
 */
const createNewPaymentMethod = async (req, res, next) => {
  try {
    const { cardDetails } = req.body;
    if (Object.values(cardDetails) < 4) {
      return res.status(400).json("Invalid card details");
    }
    let paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: cardDetails,
    });
    res.json({ payment_method_id: paymentMethod.id });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {string} req.user.stripeCustomerId
 * @param {*} res
 * @param {*} next
 *
 * @returns All available card payment methods for a given stripe customer id
 */
const getAllCardPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: "card",
    });
    res.json(paymentMethods);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  createNewPaymentMethod,
  getAllCardPaymentMethods,
};
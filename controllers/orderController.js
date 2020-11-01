const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const stripe = require("stripe")(
  "sk_test_51HhUbGDRaW3L2zxrOz9d8TOvQRpmQxM489GvgsN0IXlKJS4lN5LK4YUn3INZ2wWeQfwtwZAjKuT5sJHXnqJn5NDj00XE57kVEF"
);

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns {Array} orders array with user and orderItems.productId populated
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user")
      .populate({ path: "orderItems", populate: { path: "productId" } });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {Object} req.body.shipping
 * @property shipping:{address:String,city:String,postalCode:String,country:String}
 * @param {Number} req.body.itemsPrice
 * @param {Number} req.body.shippingPrice
 * @param {Number} req.body.totalPrice
 * @param {Array} req.body.orderItems
 * @property orderItems:[{quantity:Number,productId:ObjectId}]
 * @param {*} res
 *
 * @returns status 201 with new order object
 */

const createOrders = async (req, res, next) => {
  try {
    const user = req.user._id;
    const ordDetails = req.body;
    const {
      shipping,
      itemsPrice,
      shippingPrice,
      totalPrice,
      orderItems,
    } = ordDetails;

    let newOrder = new Order({
      user,
      orderItems,
      shipping,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    newOrder = await newOrder.save();
    newOrder = await newOrder
      .populate("user")
      .populate({ path: "orderItems", populate: { path: "productId" } })
      .execPopulate();
    res.status(201).json({ messsage: "New Order Created", data: newOrder });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {ObjectId} req.params.id
 * @param {*} res
 *
 * @returns status 404 if order not found
 * @returns deleted object with success message
 */
const deleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findByIdAndDelete(id);
    if (!order)
      return res.status(404).json({ message: "No order with the given id" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {ObjectID} req.params.id
 * @param {*} res
 *
 * @returns status 404 if order not found
 * @returns status 200 with order paid message and order object
 *
 * sets isPaid,paidAt,payment properties and save the order document
 */

const pay = async (req, res, next) => {
  try {
    const { customer, _id: user } = req.user;
    const { orderItems, cardDetails } = req.body;
    let ids = req.body.orderItems.map((p) => p.productId);
    const products = await Product.find()
      .where("_id")
      .in(ids)
      .select("price")
      .exec();

    let amount = 0;
    for (let i = 0; i < products.length; i++) {
      if (orderItems[i].productId === String(products[i]._id))
        amount += products[i].price * orderItems[i].quantity;
    }

    const details = await stripe.customers.retrieve(customer);
    if (!details.default_source && !cardDetails)
      return res.status(400).json("No payment source");
    else if (cardDetails) {
      const token = await stripe.tokens.create({ card: cardDetails });
      await stripe.customers.createSource(customer, { source: token.id });
    }
    const charge = await stripe.charges.create({
      amount,
      currency: "inr",
      customer,
    });

    const { paid } = charge;
    if (!paid) return res.status(402).end();

    const order = new Order({
      user,
      isPaid: paid,
      orderItems,
      totalPrice: amount,
      paidAt: Date.now(),
      stripe_charge: charge.id,
    });
    res
      .status(201)
      .json({ message: "Order places successfully!", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  createOrders,
  deleteOrder,
  pay,
};

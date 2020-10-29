const Order = require("../models/Order");

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
const payForOrder = async (req, res) => {
  try {
    const id = req.params.id;
    let order = await Order.findById(id);
    if (!order) return res.status(404).json("Order Not Found");

    order.isPaid = true;
    order.paidAt = Date.now();
    order.payment = "paypal";
    order = await order.save();
    order = await order
      .populate("user")
      .populate({ path: "orderItems", populate: { path: "productId" } })
      .execPopulate();

    res.status(200).json({ messsage: "Order Paid", order });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

module.exports = { getAllOrders, createOrders, deleteOrder, payForOrder };

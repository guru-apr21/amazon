const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "productId" } });
  res.json(orders);
};

const createOrders = async (req, res) => {
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
};

const deleteOrder = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findByIdAndDelete(id);
  if (!order)
    return res.status(404).json({ message: "No order with the given id" });
  res.json({ message: "Order deleted Successfully", data: order });
};

const payForOrder = async (req, res) => {
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
};

module.exports = { getAllOrders, createOrders, deleteOrder, payForOrder };

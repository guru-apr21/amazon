const Order = require("../models/Order");

const getAllOrders = async () => {
  const orders = await Order.find({})
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "productId" } });
  return orders;
};

const createOrders = async (user, ordDetails) => {
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
  return newOrder;
};

const deleteOrderById = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  return order;
};

const payForOrder = async (id) => {
  const order = await Order.findById(id);
  if (!order) return order;

  order.isPaid = true;
  order.paidAt = Date.now();
  order.payment = "paypal";
  let updatedOrder = await order.save();
  updatedOrder = await updatedOrder
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "productId" } })
    .execPopulate();
  return updatedOrder;
};

module.exports = { getAllOrders, createOrders, deleteOrderById, payForOrder };

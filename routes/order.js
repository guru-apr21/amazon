const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");
const { findCartByUserId } = require("../controllers/cartController");

router.get("/", [authenticateJwt, roleAuth], async (req, res) => {
  const orders = await Order.find({}).populate("user");
  res.json(orders);
});

router.post("/", authenticateJwt, async (req, res) => {
  const user = req.user._id;
  const { products: orderItems } = await findCartByUserId(user);

  const { shipping, itemsPrice, shippingPrice, totalPrice, payment } = req.body;

  let newOrder = new Order({
    user,
    orderItems,
    shipping,
    payment,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  neworder = await newOrder.save();

  res.status(201).json({ messsage: "New Order Created", data: newOrder });
});

router.put("/:id/pay", authenticateJwt, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json("Order Not Found");

  console.log(order);

  order.isPaid = true;
  order.paidAt = Date.now();
  order.payment = "paypal";
  const updatedOrder = await order.save();
  console.log(updatedOrder);
  res.status(200).json({ messsage: "Order Paid", order: updatedOrder });
});

module.exports = router;

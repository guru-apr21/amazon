const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");
const {
  orderController: { getAllOrders, createOrders, deleteOrderById, payForOrder },
} = require("../controllers/index");

router.get("/", [authenticateJwt, roleAuth], async (req, res) => {
  const orders = await getAllOrders();
  res.json(orders);
});

router.post("/", authenticateJwt, async (req, res) => {
  const user = req.user._id;

  const newOrder = await createOrders(user, req.body);

  res.status(201).json({ messsage: "New Order Created", data: newOrder });
});

router.delete("/:id", [authenticateJwt, roleAuth], async (req, res) => {
  const order = await deleteOrderById(req.params.id);
  if (!order)
    return res.status(404).json({ message: "No order with the given id" });
  res.json({ message: "Order deleted Successfully", data: order });
});

router.put("/:id/pay", authenticateJwt, async (req, res) => {
  const order = await payForOrder(req.params.id);

  if (!order) return res.status(404).json("Order Not Found");
  res.status(200).json({ messsage: "Order Paid", order });
});

module.exports = router;

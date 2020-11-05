const express = require("express");
const router = express.Router();
const { allowIfLoggedIn } = require("../middleware/auth");
const { orderController } = require("../controllers/main");
const { seller } = require("../middleware/role");

//Respond with all orders
router.get("/", allowIfLoggedIn, seller, orderController.getAllOrders);

//Create new order and respond with the order details
router.post("/", allowIfLoggedIn, orderController.createOrders);

//Delete an existing order and respond with the deleted order
router.delete("/:id", allowIfLoggedIn, seller, orderController.deleteOrder);

//Makes payment for an existing order and respond with the order details
// router.put("/:id/pay",  orderController.payForOrder);

module.exports = router;

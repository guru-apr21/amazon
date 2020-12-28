const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");

const { orderController } = require("../controllers/main");

//Respond with all orders
router.get("/", authenticateJwt, roleAuth, orderController.getAllOrders);

//Create new order and respond with the order details
router.post("/", authenticateJwt, orderController.createOrders);

//Delete an existing order and respond with the deleted order
router.delete("/:id", authenticateJwt, roleAuth, orderController.deleteOrder);

//make payment using stripe api
router.post("/payment", authenticateJwt, orderController.pay);

module.exports = router;

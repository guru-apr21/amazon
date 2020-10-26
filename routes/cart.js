const express = require("express");
const router = express.Router();
const { cartController } = require("../controllers/main");

const authenticateJwt = require("../middleware/auth");

//Get items in the cart
router.get("/", authenticateJwt, cartController.getCartItems);

//Create cart if not available & update quantity of the product
router.post("/", authenticateJwt, cartController.createCart);

//remove a product from the cart
router.put("/", authenticateJwt, cartController.removeProdFromCart);

//empty cart
router.delete("/", authenticateJwt, cartController.emptyCart);

module.exports = router;

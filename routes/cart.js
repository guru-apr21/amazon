const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

const authenticateJwt = require("../middleware/auth");

router.post("/cart", authenticateJwt, async (req, res) => {
  try {
    const { productId, quantity, title, price } = req.body;

    const { _id: userId } = req.user;
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const itemIndex = cart.products.findIndex(
        (p) => p.productId === productId
      );
      itemIndex > -1
        ? (cart.products[itemIndex].quantity = quantity)
        : cart.products.push({ productId, quantity, title, price });
      cart = await cart.save();
      res.status(201).json(cart);
    } else {
      let newCart = new Cart({
        userId,
        products: [{ productId, quantity, title, price }],
      });
      newCart = await newCart.save();
      res.status(201).json(newCart);
    }
  } catch (err) {
    console.log(err);
    res.send("Something went wrong!");
  }
});

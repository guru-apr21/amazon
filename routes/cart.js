const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const User = require("../models/Users");

const authenticateJwt = require("../middleware/auth");

router.get("/", authenticateJwt, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate("userId");
  res.json(cart);
});

router.post("/", authenticateJwt, async (req, res) => {
  try {
    const { productId, quantity, title, price } = req.body;
    const { _id: userId } = req.user;
    console.log(userId);

    let cart = await Cart.findOne({ userId }).populate("User", User);
    console.log(cart);

    if (cart) {
      const itemIndex = cart.products.findIndex(
        (p) => String(p.productId) === productId
      );
      console.log("ItemIndex ", itemIndex);

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity = quantity;
      } else {
        cart.products.push({ productId, quantity, title, price });
      }

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

module.exports = router;

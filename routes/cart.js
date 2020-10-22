const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const User = require("../models/Users");

const authenticateJwt = require("../middleware/auth");

router.get("/", authenticateJwt, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate("userId");

  if (!cart || cart.products.length < 1)
    return res.status(400).json("Cart is empty");
  res.json(cart);
});

//Create cart if not available & update quantity of the product
router.post("/", authenticateJwt, async (req, res) => {
  try {
    const { productId, quantity, title, price } = req.body;
    const { _id: userId } = req.user;

    const user = await User.findById(userId);
    if (!user) return res.status(400).send("Invalid token");

    let cart = await Cart.findOne({ userId }).populate("userId");

    if (cart) {
      const itemIndex = cart.products.findIndex(
        (p) => String(p.productId) === productId
      );

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
      newCart.populate("userId").execPopulate();
      res.status(201).json(newCart);
    }
  } catch (err) {
    console.log(err);
    res.send("Something went wrong!");
  }
});

//remove a product from the cart
router.put("/products/:id", authenticateJwt, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId }).populate("userId");
  cart.products = cart.products.filter(
    (p) => String(p.productId) !== productId
  );
  cart = await cart.save();
  if (cart.products.length < 1) return res.json("Cart is empty");
  res.status(201).json(cart);
});

//empty cart
router.delete("/", authenticateJwt, async (req, res) => {
  const { _id: userId } = req.user;
  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(400).json("Cart is empty");

  cart.products = [];
  cart = await cart.save();
  res.json("Cart is emptied");
});

module.exports = router;

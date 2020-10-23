const express = require("express");
const router = express.Router();
const {
  cartController: {
    findCartByUserId,
    createNewCart,
    addProdToCart,
    removeProductFromCart,
    clearCart,
  },
  userController: { findUserById },
} = require("../controllers/index");

const authenticateJwt = require("../middleware/auth");

router.get("/", authenticateJwt, async (req, res) => {
  const cart = await findCartByUserId(req.user._id);

  if (!cart || cart.products.length < 1)
    return res.status(400).json("Cart is empty");
  res.json(cart);
});

//Create cart if not available & update quantity of the product
router.post("/", authenticateJwt, async (req, res) => {
  const { ...product } = req.body;
  const { _id: userId } = req.user;

  const user = await findUserById(userId);
  if (!user) return res.status(400).send("No user with the given id");

  let cart = await findCartByUserId(userId);

  if (cart) {
    cart = await addProdToCart(cart, product);
    res.status(201).json(cart);
  } else {
    let newCart = await createNewCart(userId, [product]);
    res.status(201).json(newCart);
  }
});

//remove a product from the cart
router.put("/", authenticateJwt, async (req, res) => {
  const productId = req.body.id;
  const userId = req.user._id;

  let cart = await findCartByUserId(userId);
  cart = await removeProductFromCart(cart, productId);
  if (cart.products.length < 1) return res.json("Cart is empty");
  res.status(201).json(cart);
});

//empty cart
router.delete("/", authenticateJwt, async (req, res) => {
  const userId = req.user._id;
  let cart = await findCartByUserId(userId);
  if (!cart || cart.products.length < 1)
    return res.status(400).json("Cart is empty already");
  await clearCart(cart);
  res.json("Cart is emptied");
});

module.exports = router;

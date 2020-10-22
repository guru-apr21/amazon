const Cart = require("../models/Cart");
const findCartByUserId = async (id) => {
  const cart = await Cart.findOne({ userId: id }).populate("userId");
  return cart;
};

const createNewCart = async (userId, products) => {
  let cart = new Cart({ userId, products });
  cart = await cart.save();
  cart.populate("userId").execPopulate();
  return cart;
};

const addProdToCart = async (cart, product) => {
  const { productId, quantity, title, price } = product;

  const itemIndex = cart.products.findIndex(
    (p) => String(p.productId) === productId
  );

  if (itemIndex > -1) {
    cart.products[itemIndex].quantity = quantity;
  } else {
    cart.products.push({ productId, quantity, title, price });
  }
  cart = await cart.save();
  return cart;
};
module.exports = { findCartByUserId, createNewCart, addProdToCart };

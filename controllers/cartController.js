const Cart = require("../models/Cart");
const userController = require("./userController");

/*Query the Cart collection from db by userId and returns 
if available ,If not returns a message with 400 status*/
const getCartItems = async (req, res) => {
  const cart = await findCartByUserId(req.user._id);

  if (!cart || cart.products.length < 1)
    return res.status(400).json("Cart is empty");
  res.json(cart);
};

const createCart = async (req, res) => {
  const { ...product } = req.body;
  const { _id: userId } = req.user;

  const user = await userController.findUserById(userId);
  if (!user) return res.status(400).send("No user with the given id");

  let cart = await findCartByUserId(userId);

  if (cart) {
    cart = await addProdToCart(cart, product);
    res.status(201).json(cart);
  } else {
    let newCart = await createNewCart(userId, [product]);
    res.status(201).json(newCart);
  }
};

const removeProdFromCart = async (req, res) => {
  const productId = req.body.id;
  const userId = req.user._id;

  let cart = await findCartByUserId(userId);
  cart = await removeProductFromCart(cart, productId);
  if (cart.products.length < 1) return res.json("Cart is empty");
  res.status(201).json(cart);
};

const emptyCart = async (req, res) => {
  const userId = req.user._id;
  let cart = await findCartByUserId(userId);
  if (!cart || cart.products.length < 1)
    return res.status(400).json("Cart is empty already");
  await clearCart(cart);
  res.json("Cart is emptied");
};

//
//
//
//
//

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

const removeProductFromCart = async (cart, productId) => {
  cart.products = cart.products.filter(
    (p) => String(p.productId) !== productId
  );
  cart = await cart.save();
  return cart;
};

const clearCart = async (cart) => {
  cart.products = [];
  cart = await cart.save();
};

module.exports = {
  findCartByUserId,
  createNewCart,
  addProdToCart,
  removeProductFromCart,
  clearCart,
  getCartItems,
  createCart,
  removeProdFromCart,
  emptyCart,
};

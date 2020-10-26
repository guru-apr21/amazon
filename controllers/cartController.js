const Cart = require("../models/Cart");
const userController = require("./userController");

const findCartByUserId = async (id) => {
  const cart = await Cart.findOne({ userId: id }).populate("userId");
  return cart;
};

/*Query the Cart collection from db by userId and returns 
if available ,If not returns a message with 400 status*/
const getCartItems = async (req, res) => {
  const cart = await findCartByUserId(req.user._id);

  if (!cart || cart.products.length < 1)
    return res.status(400).json("Cart is empty");
  res.json(cart);
};

/**
 * Query the db for cart with given userId
 * If found add items to the cart
 * Or else create new cart
 */
const createCart = async (req, res) => {
  const { _id: userId } = req.user;
  const { productId, quantity, title, price } = req.body;

  const user = await userController.findUserById(userId);
  if (!user) return res.status(400).send("No user with the given id");

  let cart = await Cart.findOne({ userId }).populate("userId");

  if (cart) {
    const itemIndex = cart.products.findIndex(
      (p) => String(p.productId) === productId
    );

    /*
     *Find the index of item in the products array
     *
     *If < 0 push product into products array
     *If > 0 update the quantity
     *
     */

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = quantity;
    } else {
      cart.products.push({ productId, quantity, title, price });
    }
    cart = await cart.save();

    res.status(201).json(cart);
  } else {
    /**
     * Create new cart if the user has no cart
     */
    cart = new Cart({
      userId,
      products: [{ productId, quantity, title, price }],
    });
    cart = await cart.save();
    cart.populate("userId").execPopulate();
    res.status(201).json(newCart);
  }
};

/**
 *
 * Query the db for cart with given userID
 * Remove the item from products array
 *
 */
const removeProdFromCart = async (req, res) => {
  const productId = req.body.id;
  const userId = req.user._id;

  let cart = await findCartByUserId(userId);
  cart.products = cart.products.filter(
    (p) => String(p.productId) !== productId
  );
  cart = await cart.save();

  if (cart.products.length < 1) return res.json("Cart is empty");
  res.status(201).json(cart);
};

/**
 *
 * Remove all items from the products array
 *
 */
const emptyCart = async (req, res) => {
  const userId = req.user._id;
  let cart = await findCartByUserId(userId);

  if (!cart || cart.products.length < 1)
    return res.status(400).json("Cart is empty already");

  cart.products = [];
  cart = await cart.save();
  res.json("Cart is emptied");
};

module.exports = {
  findCartByUserId,
  getCartItems,
  createCart,
  removeProdFromCart,
  emptyCart,
};

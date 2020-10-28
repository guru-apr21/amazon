const Cart = require("../models/Cart");
const userController = require("./userController");

class Response extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

const findCartByUserId = async (id) => {
  const cart = await Cart.findOne({ userId: id }).populate("userId");
  return cart;
};

/**
 * @param {ObjectID} req.user._id
 * @param {*} res
 *
 * @returns status 204 if cart is empty
 * @returns cart object of given user
 *
 * Query the Cart collection from db by userId and returns
 * if available ,If not returns a message with 400 status
 */

const getCartItems = async (req, res, next) => {
  try {
    const cart = await findCartByUserId(req.user._id);
    if (!cart || cart.products.length < 1) return next(new Response(204));
    return next(new Response(200, cart));
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {ObjectId} req.user._id
 * @param {ObjectId} req.body.productId
 * @param {Number} req.body.quantity
 * @param {String} req.body.title
 * @param {Number} req.body.price
 *
 * @param {*} res
 * @returns status 404 if user not found
 * @returns status 201 with cart object
 *
 * Query the db for cart with given userId
 * If found add items to the cart
 * Or else create new cart
 */
const createCart = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { productId, quantity, title, price } = req.body;

    const user = await userController.findUserById(userId);
    if (!user) return next(new Response(404, "User not found"));

    let cart = await Cart.findOne({ userId: userId }).populate("userId");

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

      next(new Response(200, cart));
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
      next(new Response(201, cart));
    }
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {ObjectID} req.user._id
 * @param {ObjectID} req.body.id
 * @param {*} res
 *
 * @returns status 204 if cart is empty
 * @returns status 200 with updated cart object
 *
 * Query the db for cart with given userID
 * Remove a productid from cart's products array
 */

const removeProdFromCart = async (req, res, next) => {
  try {
    const productId = req.body.id;
    const userId = req.user._id;

    let cart = await findCartByUserId(userId);
    cart.products = cart.products.filter(
      (p) => String(p.productId) !== productId
    );
    cart = await cart.save();

    next(new Response(200, cart));
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {ObjectID} req.user._id
 * @param {*} res
 *
 * @returns status 400 if cart is empty already
 * @returns success message
 */
const emptyCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let cart = await findCartByUserId(userId);

    if (!cart || cart.products.length < 1) return next(new Response(400));

    cart.products = [];
    cart = await cart.save();
    res.json("Cart is emptied");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findCartByUserId,
  getCartItems,
  createCart,
  removeProdFromCart,
  emptyCart,
};

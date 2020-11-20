const Order = require('../models/Order');
const { User } = require('../models/User');

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns {Array} orders array with user and orderItems.productId populated
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user')
      .populate({ path: 'orderItems', populate: { path: 'productId' } });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {ObjectId} req.params.id
 * @param {*} res
 *
 * @returns status 404 if order not found
 * @returns deleted object with success message
 */
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params.id;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'No order with the given id' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const createNewOrder = async (req, res, next) => {
  try {
    const { orderItems, paymentIntentId, totalPrice } = req.body;
    const order = new Order({
      orderItems,
      user: req.user._id,
      paidAt: Date.now(),
      status: 'placed',
      isPaid: true,
      totalPrice,
      stripePaymentIntentId: paymentIntentId,
    });
    await order.save();
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: 'No user with the given id.' });
    }
    let orders = await Order.find({ user: req.user._id });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrders, deleteOrder, createNewOrder, getUserOrders };

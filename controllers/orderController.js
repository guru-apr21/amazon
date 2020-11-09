const Order = require('../models/Order');

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

module.exports = { getAllOrders, deleteOrder };

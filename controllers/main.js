const cartController = require('./cartController');
const orderController = require('./orderController');
const productController = require('./productController');
const categoryController = require('./categoryController');
const userController = require('./userController');
const reviewController = require('./reviewController');
const paymentController = require('./paymentController');
const addressController = require('./addressController');

module.exports = {
  addressController,
  cartController,
  categoryController,
  productController,
  userController,
  orderController,
  reviewController,
  paymentController,
};

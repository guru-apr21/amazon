const express = require('express');

const router = express.Router();
const { cartController } = require('../controllers/main');
const { allowIfLoggedIn } = require('../middleware/auth');

// Get items in the cart
router.get('/', allowIfLoggedIn, cartController.getCartItems);

// Create cart if not available & update quantity of the product
router.post('/', allowIfLoggedIn, cartController.createCart);

// remove a product from the cart
router.put('/:id', allowIfLoggedIn, cartController.removeProdFromCart);

// empty cart
router.delete('/', allowIfLoggedIn, cartController.emptyCart);

module.exports = router;

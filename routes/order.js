const express = require('express');

const router = express.Router();
const { allowIfLoggedIn } = require('../middleware/auth');
const { orderController } = require('../controllers/main');
const { seller } = require('../middleware/role');

// Respond with all orders
router.get('/', allowIfLoggedIn, seller, orderController.getAllOrders);

// Delete an existing order and respond with the deleted order
router.delete('/:id', allowIfLoggedIn, seller, orderController.deleteOrder);

module.exports = router;

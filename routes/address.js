const router = require('express').Router();
const { addressController } = require('../controllers/main');
const { allowIfLoggedIn } = require('../middleware/auth');

// Get addresses of a given userId
router.get('/', allowIfLoggedIn, addressController.getUserAddresses);

// Create new Address
router.post('/', allowIfLoggedIn, addressController.createNewAddress);

// Update existing address
router.put('/:id', allowIfLoggedIn, addressController.updateAddress);

// Delete address by id
router.delete('/', allowIfLoggedIn, addressController.deleteAddressById);

module.exports = router;

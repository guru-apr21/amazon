const express = require('express');
const multer = require('multer');

const router = express.Router();
const { allowIfLoggedIn } = require('../middleware/auth');
const { seller } = require('../middleware/role');
const { productController } = require('../controllers/main');

const upload = multer({ dest: 'temp/' }).array('products', 4);

// Respond with all available products
router.get('/', productController.getProducts);

// Respond with the product of given id in params
router.get('/:id', productController.getProduct);

// Create and respond with the new product
router.post('/', allowIfLoggedIn, seller, productController.createNewProduct);

// Update the product details and respond with the updated object
router.put('/:id', allowIfLoggedIn, seller, productController.updateProduct);

// Delete a product and respond with the deleted product
router.delete('/:id', allowIfLoggedIn, seller, productController.deleteProduct);

router.get(
  '/user/:id',
  allowIfLoggedIn,
  seller,
  productController.getUserProducts
);

router.post(
  '/:id/upload-images',
  allowIfLoggedIn,
  seller,
  upload,
  productController.uploadProductImages
);

module.exports = router;

const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");

const { productController } = require("../controllers/main");

const multer = require("multer");
const upload = multer({ dest: "temp/" }).array("products", 4);

//Respond with all available products
router.get("/", productController.getProducts);

//Respond with the product of given id in params
router.get("/:id", productController.getProduct);

//Create and respond with the new product
router.post("/", authenticateJwt, roleAuth, productController.createNewProduct);

//Update the product details and respond with the updated object
router.put("/:id", authenticateJwt, roleAuth, productController.updateProduct);

//Delete a product and respond with the deleted product
router.delete(
  "/:id",
  authenticateJwt,
  roleAuth,
  productController.deleteProduct
);

router.post("/upload-images", upload, productController.uploadProductImages);

module.exports = router;

const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const Category = require("../models/Category");
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");
const {
  getProduct,
  getProducts,
  createNewProduct,
  updateProduct,
} = require("../controllers/product");

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

router.get("/:id", async (req, res) => {
  let product = await getProduct(req.params.id);
  if (!product)
    return res.status(400).json({ error: "No product with the given id" });
  res.json(product);
});

router.post("/", [authenticateJwt, roleAuth], async (req, res) => {
  const { ...newProduct } = req.body;
  let product = await createNewProduct(newProduct, res);
  res.status(201).json(product);
});

router.put("/:id", [authenticateJwt, roleAuth], async (req, res) => {
  const id = req.params.id;
  const product = await updateProduct(id, req.body);
  if (!product)
    return res.status(400).json({ error: "No product with the given id" });
  res.json(product);
});

router.delete("/:id", [authenticateJwt, roleAuth], async (req, res) => {
  const admin = req.user.admin;
  if (!admin) return res.status(403).json({ error: "Access denied" });

  const id = req.params.id;

  const product = await Product.findByIdAndDelete(id).populate("categoryId");
  if (!product) return res.status(400).json({ error: "No such product" });

  let { products, _id } = product.categoryId;
  products = products.filter((p) => String(p) !== id);

  const category = await Category.findByIdAndUpdate(
    _id,
    { products },
    { new: true }
  );
  console.log(category);
  res.status(200).json(product);
});

module.exports = router;

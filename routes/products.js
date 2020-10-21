const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const Category = require("../models/Category");
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");

router.get("/", async (req, res) => {
  const products = await Product.find().populate("categoryId");
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("categoryId");
  if (!product) return res.status(400).json({ error: "No such products" });
  res.json(product);
});

router.post("/", [authenticateJwt, roleAuth], async (req, res) => {
  const { title, description, price, categoryId } = req.body;
  let product = new Product({ title, description, price, categoryId });

  let category = await Category.findById(categoryId);
  if (!category) return res.status(400).json({ error: "No such category" });

  const products = [...category.products, product._id]; //Array of productId's belonging to a category
  category.products = products;
  await category.save();

  product = await product.save();
  product = await product.populate("categoryId").execPopulate();
  res.status(201).json(product);
});

router.put("/:id", [authenticateJwt, roleAuth], async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!product)
    return res.status(400).json({ error: "No product with the given id" });
  res.json(product);
});

router.delete("/:id", [authenticateJwt, roleAuth], async (req, res) => {
  const admin = req.user.admin;
  if (!admin) return res.status(403).json({ error: "Access denied" });

  const id = req.params.id;
  console.log(id);

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
  res.status(201).json(product);
});

module.exports = router;

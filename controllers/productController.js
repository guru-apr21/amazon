const Category = require("../models/Category");
const Product = require("../models/Product");
const { findCategoryById } = require("./categoryController");

const getProducts = async (req, res) => {
  let products = await Product.find()
    .populate("categoryId")
    .populate("reviews");
  res.json(products);
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  let product = await Product.findById(id).populate("categoryId");
  if (!product) return res.status(404).send("No product with the given id");
  res.json(product);
};

const createNewProduct = async (req, res) => {
  const { ...newProduct } = req.body;

  let product = new Product(newProduct);

  let category = await findCategoryById(newProduct.categoryId);
  if (!category) return res.status(400).json({ error: "No such category" });
  const products = [...category.products, product._id]; //Array of productId's belonging to a category
  category.products = products;

  await category.save();
  product = await product.save();
  product = await product.populate("categoryId").execPopulate();

  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const updateObj = req.body;
  const product = await Product.findByIdAndUpdate(id, updateObj, {
    new: true,
  });
  if (!product)
    return res.status(400).json({ error: "No product with the given id" });
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id).populate("categoryId");
  if (!product) return res.status(400).json("No product with the given id");

  let { products, _id } = product.categoryId;
  products = products.filter((p) => String(p) !== id);

  await Category.findByIdAndUpdate(_id, { products });
  res.status(204).json(product);
};

module.exports = {
  getProduct,
  getProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
};

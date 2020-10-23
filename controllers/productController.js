const Product = require("../models/Product");
const { findCategoryById } = require("./categoryController");

const getProduct = async (id) => {
  let product = await Product.findById(id).populate("categoryId");
  return product;
};

const getProducts = async () => {
  let products = await Product.find().populate("categoryId");
  return products;
};

const createNewProduct = async (newProduct, category) => {
  let product = new Product(newProduct);
  const products = [...category.products, product._id]; //Array of productId's belonging to a category
  category.products = products;

  await category.save();
  product = await product.save();
  product = await product.populate("categoryId").execPopulate();

  return product;
};

const updateProduct = async (id, product) => {
  const newProduct = await Product.findByIdAndUpdate(id, product, {
    new: true,
  });
  return newProduct;
};

const deleteProductById = async (id) => {
  const product = await Product.findByIdAndDelete(id).populate("categoryId");
  return product;
};

module.exports = {
  getProduct,
  getProducts,
  createNewProduct,
  updateProduct,
  deleteProductById,
};

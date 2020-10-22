const Product = require("../models/Products");
const { findCategoryById } = require("../controllers/category");

const getProduct = async (id) => {
  let product = await Product.findById(id).populate("categoryId");
  return product;
};

const getProducts = async () => {
  let products = await Product.find().populate("categoryId");
  return products;
};

const createNewProduct = async (newProduct, res) => {
  let product = new Product(newProduct);

  let category = await findCategoryById(newProduct.categoryId);
  if (!category) return res.status(400).json({ error: "No such category" });

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

module.exports = { getProduct, getProducts, createNewProduct, updateProduct };

const Category = require("../models/Category");

const getAllCategory = async (req, res) => {
  let category = await Category.find().populate("products");
  res.json(category);
};

const createNewCategory = async (req, res) => {
  const title = req.body.title;
  let category = new Category({ title });
  category = await category.save();
  res.json(category);
};

const findCategoryById = async (id) => {
  const category = await Category.findById(id);
  return category;
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const updateObj = req.body;
  const category = await Category.findByIdAndUpdate(id, updateObj, {
    new: true,
  });
  if (!category) return res.status(400).json("No category with the given id");
  res.json(category);
};

const delCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) return res.status(400).json("No category with the given id");
  res.status(200).json(category);
};

module.exports = {
  createNewCategory,
  findCategoryById,
  updateCategory,
  getAllCategory,
  delCategory,
};

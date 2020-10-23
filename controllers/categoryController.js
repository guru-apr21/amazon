const Category = require("../models/Category");

const getAllCategory = async () => {
  let category = await Category.find().populate("products");
  return category;
};

const createNewCategory = async (title) => {
  let category = new Category({ title });
  category = await category.save();
  return category;
};

const findCategoryById = async (id) => {
  const category = await Category.findById(id);
  console.log(category);
  return category;
};

const updateCategory = async (id, updateObj) => {
  const category = await Category.findByIdAndUpdate(id, updateObj, {
    new: true,
  });
  return category;
};

const delCategoryById = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  return;
};

module.exports = {
  createNewCategory,
  findCategoryById,
  updateCategory,
  getAllCategory,
  delCategoryById,
};

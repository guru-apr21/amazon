const Category = require("../models/Category");
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

module.exports = { createNewCategory, findCategoryById };

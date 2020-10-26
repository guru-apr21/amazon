const Category = require("../models/Category");

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns {Array} Array of category documents with products field populated
 */
const getAllCategory = async (req, res) => {
  let category = await Category.find().populate("products");
  res.json(category);
};

/**
 *
 * @param {String} req.body.title
 * @param {*} res
 *
 * @returns {Array} Array of category documents with products field populated
 */
const createNewCategory = async (req, res) => {
  const title = req.body.title;
  let category = new Category({ title });
  category = await category.save();
  res.json(category);
};

/**
 *
 * @param {ObjectID} id
 * @returns {Object} category object with the given id
 */
const findCategoryById = async (id) => {
  const category = await Category.findById(id);
  return category;
};

/**
 *
 * @param {ObjectID} req.params.id
 * @param {Object} req.body @property title:String,products:Array of product ids
 *
 * @returns status 404 if Category not found
 * @returns updated category object
 */
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const updateObj = req.body;
  const category = await Category.findByIdAndUpdate(id, updateObj, {
    new: true,
  });
  if (!category) return res.status(404).json("Category not found");
  res.json(category);
};

/**
 *
 * @param {ObjectID} req.params.id
 * @param {*} res
 *
 * @returns status 404 if Category not found
 * @returns status 200 with deleted category
 */
const delCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) return res.status(404).json("Category not found");
  res.status(200).json(category);
};

module.exports = {
  createNewCategory,
  findCategoryById,
  updateCategory,
  getAllCategory,
  delCategory,
};

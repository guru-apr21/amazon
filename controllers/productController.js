const Category = require('../models/Category');
const Product = require('../models/Product');
const { findCategoryById } = require('./categoryController');
const { uploadToS3 } = require('../services/file_upload');

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns {Array} products array with reviews and categoryId populated
 */
const getProducts = async (req, res, next) => {
  try {
    const searchString = req.query.text || '';
    const limit = req.query.limit || 10;
    const sortFields = req.query.sort || 'price';
    const products = await Product.find({
      $or: [
        {
          title: { $regex: searchString, $options: 'i' },
        },
        { description: { $regex: searchString, $options: 'i' } },
      ],
    })
      .populate('categoryId')
      .limit(Number(limit))
      .sort(sortFields);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {ObjectID} req.params.id
 * @param {*} res
 *
 * @returns {Object} product object with the provided params id
 */
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('categoryId')
      .populate('reviews');
    if (!product) return res.status(404).send('No product with the given id');
    res.json(product);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {String} req.body.title
 * @param {String} req.body.description
 * @param {Number} req.body.price
 * @param {String} req.body.brand
 * @param {ObjectID} req.body.categoryId
 * @param {*} res
 *
 * @returns status 404 if category not found
 * @returns status 201 with new product object
 *
 * Also updates the products array in category documents
 */
const createNewProduct = async (req, res, next) => {
  try {
    const { ...newProduct } = req.body;

    let product = new Product({ ...newProduct, user: req.user._id });

    const category = await findCategoryById(newProduct.categoryId);
    if (!category) return res.status(404).json('Category not found!');

    // Array of productId's belonging to a category
    const products = [...category.products, product._id];
    category.products = products;

    await category.save();
    product = await product.save();
    product = await product.populate('categoryId').execPopulate();

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {ObjectID} req.params.id
 * @param {Object} req.body Object with update details
 * @param {*} res
 *
 * @returns status 404 if no product is found
 * @returns updated product object
 */

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateObj = req.body;
    let product = await Product.findById(id);
    if (!product) return res.status(404).json('Product not found');
    if (req.user.role !== 'superAdmin') {
      if (product.user !== req.user._id) {
        return res.status(401).json({ error: 'Access Denied' });
      }
    }
    product = await Product.findByIdAndUpdate(id, updateObj, { new: true });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {ObjectID} req.params.id
 * @param {*} res
 *
 * @returns status 404 if product not found
 * @returns status 204 with deleted object
 *
 * Also updates the products array in category documets
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params.id;
    let product = await Product.findById(id);
    if (!product) return res.status(404).json('Product not found');
    if (req.user.role !== 'superAdmin') {
      if (product.user !== req.user._id) {
        return res.status(401).json({ error: 'Access Denied' });
      }
    }
    product = await Product.findByIdAndDelete(id).populate('categoryId');

    let { products } = product.categoryId;
    const { _id } = product.categoryId;
    products = products.filter((p) => String(p) !== id);

    await Category.findByIdAndUpdate(_id, { products });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {File} req.files
 * @param {} req.body.productId
 * @param {*} res
 * @param {*} next
 *
 * @returns 404 if product with the given id is not found
 * @returns 200 if images uploaded successfully to aws s3
 * and stores the cloudfront url in db
 */

const uploadProductImages = async (req, res, next) => {
  try {
    const productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) return res.status(404).json('Product not found');
    if (req.user.role !== 'superAdmin') {
      if (product.user !== req.user._id) {
        return res.status(401).json({ error: 'Access Denied' });
      }
    }
    const images = await uploadToS3(req.files, 'productImages');

    product = await Product.findByIdAndUpdate(
      productId,
      { images },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProduct,
  getProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
};

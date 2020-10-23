const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");
const {
  productController: {
    getProduct,
    getProducts,
    createNewProduct,
    updateProduct,
    deleteProductById,
  },
  categoryController: { updateCategory, findCategoryById },
} = require("../controllers/index");

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

  let category = await findCategoryById(newProduct.categoryId);
  if (!category) return res.status(400).json({ error: "No such category" });

  let product = await createNewProduct(newProduct, category);
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
  const id = req.params.id;

  const product = await deleteProductById(id);
  if (!product) return res.status(400).json("No product with the given id");

  let { products, _id } = product.categoryId;
  products = products.filter((p) => String(p) !== id);

  await updateCategory(_id, { products });
  res.status(204).json(product);
});

module.exports = router;

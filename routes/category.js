const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");
const Category = require("../models/Category");
const { createNewCategory } = require("../controllers/category");

router.get("/", async (req, res) => {
  let category = await Category.find().populate("products");
  res.json(category);
});

router.post("/", [authenticateJwt, roleAuth], async (req, res) => {
  let category = await createNewCategory(req.body.title);
  res.send(category);
});

router.put("/:id", [authenticateJwt, roleAuth], async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!category) return res.status(400).json("No category with the given id");
  res.json(category);
});

router.delete("/:id", [authenticateJwt, roleAuth], async (req, res) => {
  const id = req.params.id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) return res.status(400).json("No category with the given id");
  res.status(200).json(category);
});

module.exports = router;

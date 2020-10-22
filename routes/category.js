const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const role = require("../middleware/role");
const roleAuth = require("../middleware/role");
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  let category = await Category.find();
  res.json(category);
});

router.post("/", [authenticateJwt, roleAuth], async (req, res) => {
  try {
    const { title } = req.body;
    let category = new Category({ title });
    category = await category.save();
    res.send(category);
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
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
  res.status(204).json(category);
});

module.exports = router;

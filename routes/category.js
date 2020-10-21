const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  let category = await Category.find();
  res.json(category);
});

router.post("/", authenticateJwt, async (req, res) => {
  try {
    const admin = req.user.admin;
    if (!admin) return res.status(403).send("Access denied");

    const { title, products } = req.body;
    let category = new Category({ title, products });
    category = await category.save();
    res.send(category);
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
});

module.exports = router;

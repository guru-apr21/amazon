const express = require("express");
const router = express.Router();
const authenticateJwt = require("../middleware/auth");
const roleAuth = require("../middleware/role");

const { categoryController } = require("../controllers/main");

//Responds with all available categories
router.get("/", categoryController.getAllCategory);

//Create and respond with newly created category
router.post(
  "/",
  authenticateJwt,
  roleAuth,
  categoryController.createNewCategory
);

/*Update a existing category title or list of
products and respond with the updated category*/
router.put(
  "/:id",
  authenticateJwt,
  roleAuth,
  categoryController.updateCategory
);

/*Deletes a existing category collection from 
the database and respond with the deleted category*/
router.delete(
  "/:id",
  authenticateJwt,
  roleAuth,
  categoryController.delCategory
);

module.exports = router;

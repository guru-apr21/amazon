const express = require("express");
const router = express.Router();
const { seller, superAdmin } = require("../middleware/role");
const { allowIfLoggedIn } = require("../middleware/auth");
const { categoryController } = require("../controllers/main");

//Responds with all available categories
router.get("/", categoryController.getAllCategory);

//Create and respond with newly created category
router.post(
  "/",
  allowIfLoggedIn,
  superAdmin,
  categoryController.createNewCategory
);

/*Update a existing category title or list of
products and respond with the updated category*/
router.put(
  "/:id",
  allowIfLoggedIn,
  superAdmin,
  categoryController.updateCategory
);

/*Deletes a existing category collection from 
the database and respond with the deleted category*/
router.delete(
  "/:id",
  allowIfLoggedIn,
  superAdmin,
  categoryController.delCategory
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { userController } = require("../controllers/main");
const authenticateJwt = require("../middleware/auth");

//Respond with all available users
router.get("/", userController.getAllUsers);

//Create new user account and respond with a jwt token
router.post("/signup", userController.createUser);

//Login to the existing account and respond with a jwt token
router.post("/signin", userController.loginUser);

//Change password of an existing user
router.put("/changepwd", authenticateJwt, userController.changePassword);

//Get addresses of a given userId
router.get("/address", authenticateJwt, userController.getUserAddresses);

//Create new Address
router.post("/address", authenticateJwt, userController.createNewAddress);

module.exports = router;

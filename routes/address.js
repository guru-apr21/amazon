const router = require("express").Router();
const authenticateJwt = require("../middleware/auth");
const { addressController } = require("../controllers/main");

//Get addresses of a given userId
router.get("/", authenticateJwt, addressController.getUserAddresses);

//Create new Address
router.post("/", authenticateJwt, addressController.createNewAddress);

//Delete address by id
router.delete("/", authenticateJwt, addressController.deleteAddressById);

module.exports = router;

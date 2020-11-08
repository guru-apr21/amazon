const express = require('express');
const multer = require('multer');

const router = express.Router();
const { userController } = require('../controllers/main');

const upload = multer({ dest: 'temp/' }).single('avatar');
const { allowIfLoggedIn } = require('../middleware/auth');
const { superAdmin } = require('../middleware/role');

// Respond with all available users
router.get('/', allowIfLoggedIn, superAdmin, userController.getAllUsers);

// Create new user account and respond with a jwt token
router.post('/signup', userController.createUser);

// Login to the existing account and respond with a jwt token
router.post('/signin', userController.loginUser);

// Change password of an existing user
router.put('/changepwd', allowIfLoggedIn, userController.changePassword);

// Upload a avatar image
router.post('/avatar', allowIfLoggedIn, upload, userController.uploadAvatar);

// Delete user's existing avatar from s3 and also from db
router.delete('/avatar', allowIfLoggedIn, userController.deleteAvatar);
module.exports = router;

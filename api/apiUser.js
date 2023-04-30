const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

// auth
router.post("/signup", authController.signUp);

// user display 
router.get('/', userController.getAllUsers);

module.exports = router;
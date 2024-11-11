const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout)
router.get('/profile', authenticateUser, userController.getMyProfile);
router.get('/admins', authenticateUser, authorizeRoles('admin'), userController.getAdmins);

module.exports = router;

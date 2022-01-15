const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const userController = require('../controllers/userController')

router.get(`/friends`, auth.authenticateToken, userController.getFriends);

router.post('/', auth.authenticateToken, userController.createUser);

router.post('/login', userController.login)
 
module.exports = router;
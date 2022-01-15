const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');

router.get(`/lastMessage/:userId`, auth.authenticateToken, userController.isFriend, messageController.getLastMessage);

router.get(`/allMessages/:userId`, auth.authenticateToken, userController.isFriend, messageController.getAllMessages);

router.post(`/send/:userId`, auth.authenticateToken, userController.isFriend, messageController.sendMessage);

module.exports = router;
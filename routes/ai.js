const express = require('express');
const router = express.Router();
const { isAuth } = require('../app/middlewares/authMiddleware');
const aiController = require('../app/controllers/aiController');

router.post("/chat", isAuth, aiController.handleChat);

module.exports = router;
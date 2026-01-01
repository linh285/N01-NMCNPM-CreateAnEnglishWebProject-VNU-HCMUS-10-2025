var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');

const authController = require('../app/controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/me', isAuth, authController.getMe);



module.exports = router;
var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo  = require('../app/middlewares/restrictTo');

const userController = require('../app/controllers/userController');


router.put('/profile', isAuth, restrictTo('LEARNER', 'TEACHER', 'ADMIN'), userController.updateProfile);
router.get('/profile', isAuth, restrictTo('LEARNER', 'TEACHER', 'ADMIN'), userController.getProfile);

module.exports = router;
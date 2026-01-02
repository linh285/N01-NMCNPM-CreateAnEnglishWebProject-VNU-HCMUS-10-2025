var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo = require('../app/middlewares/restrictTo');

const courseController = require('../app/controllers/courseController');

// theo csdl thi chi TEACHER moi tao course
router.post('/', isAuth, restrictTo('TEACHER'), courseController.createCourse);
router.get('/', courseController.getAllCourses);

module.exports = router;

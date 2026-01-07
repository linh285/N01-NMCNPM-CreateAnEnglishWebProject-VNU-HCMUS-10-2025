var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo  = require('../app/middlewares/restrictTo');

const enrollmentController = require('../app/controllers/enrollmentController');


router.post('/', isAuth, restrictTo('LEARNER'), enrollmentController.createEnrollment);
router.get('/check/:courseId', isAuth, restrictTo('LEARNER'), enrollmentController.getEnrollmentById);
router.get('/my-courses', isAuth, restrictTo('LEARNER'), enrollmentController.getAllEnrollments);

module.exports = router;
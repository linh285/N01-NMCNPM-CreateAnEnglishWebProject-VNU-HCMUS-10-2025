var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo = require('../app/middlewares/restrictTo');

const courseController = require('../app/controllers/courseController');
const upload = require('../app/middlewares/uploadMiddleware');

// theo csdl thi chi TEACHER moi tao course
router.post('/', isAuth, restrictTo('TEACHER'), upload.single('thumbnail'), courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/teacher/me', isAuth, restrictTo('TEACHER'), courseController.getTeacherCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', isAuth, restrictTo('TEACHER', 'ADMIN'), upload.single('thumbnail'), courseController.updateCourse);
router.delete('/:id', isAuth, restrictTo('TEACHER', 'ADMIN'), courseController.deleteCourse);

// admin duyet course
router.put('/:idCOURSE/approve', isAuth, restrictTo('ADMIN'), courseController.approveCourse);

module.exports = router;

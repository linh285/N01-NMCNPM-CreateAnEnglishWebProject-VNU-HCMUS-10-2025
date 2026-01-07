var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo  = require('../app/middlewares/restrictTo');

const lessonController = require('../app/controllers/lessonController');
const upload = require('../app/middlewares/uploadMiddleware');

router.put('/:id', isAuth, restrictTo('TEACHER', 'ADMIN'), upload.single('video'), lessonController.updateLesson);
router.delete('/:id', isAuth, restrictTo('TEACHER', 'ADMIN'), lessonController.deleteLesson);
router.post('/:courseId', isAuth, restrictTo('TEACHER', 'ADMIN'), upload.single('video'), lessonController.createLesson);

router.get('/:id', isAuth, lessonController.getLessonById);
// get by idCourse
router.get('/:courseId/lessons', isAuth, lessonController.getLessonsByCourse);

module.exports = router;
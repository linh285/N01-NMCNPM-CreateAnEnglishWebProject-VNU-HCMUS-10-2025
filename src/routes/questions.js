var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo = require('../app/middlewares/restrictTo');

const questionController = require('../app/controllers/questionController');



router.get('/lesson/:lessonId', isAuth, questionController.getQuestionsByLesson);

router.post('/', isAuth, restrictTo('TEACHER', 'ADMIN'), questionController.createQuestion);
router.put('/:idQuestion', isAuth, restrictTo('TEACHER', 'ADMIN'), questionController.updateQuestion);
router.delete('/:idQuestion', isAuth, restrictTo('TEACHER', 'ADMIN'), questionController.deleteQuestion);

module.exports = router;

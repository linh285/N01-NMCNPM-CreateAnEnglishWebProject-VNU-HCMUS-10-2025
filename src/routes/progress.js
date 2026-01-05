var express = require('express');
var router = express.Router();

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo = require('../app/middlewares/restrictTo');

const progressController = require('../app/controllers/progressController');

// dong bo, tuc la xem lại được video ở vị trí cũ khi quay lại
router.post('/sync', isAuth, restrictTo('LEARNER'), progressController.syncProgress);
// lay all lessons da hoc để hiển thị bài đã học
router.get('/:courseId', isAuth, restrictTo('LEARNER'), progressController.getProgressByCourse);

module.exports = router;

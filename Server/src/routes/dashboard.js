const express = require('express');
const router = express.Router();
const dashboardController = require('../app/controllers/dashboardController');
const { isAuth } = require('../app/middlewares/authMiddleware');
const { restrictTo } = require('../app/middlewares/restrictTo');

router.use(isAuth, restrictTo('TEACHER', 'ADMIN'));

// GET /api/v1/dashboard/teacher-stats
router.get('/teacher-stats', dashboardController.getTeacherStats);

module.exports = router;
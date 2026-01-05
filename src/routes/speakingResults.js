const express = require('express');
const router = express.Router();

const speakingController = require('../app/controllers/speakingResultController');

const { isAuth } = require('../app/middlewares/authMiddleware');
const restrictTo = require('../app/middlewares/restrictTo');

router.post('/', isAuth, restrictTo('LEARNER'), speakingController.submitSpeakingResult);

router.get('/lesson/:lessonId', isAuth, restrictTo('LEARNER'), speakingController.getMySpeakingHistory);

module.exports = router;
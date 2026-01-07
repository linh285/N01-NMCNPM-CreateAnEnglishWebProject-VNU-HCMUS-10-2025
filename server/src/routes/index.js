
const express = require('express');

const authRouter = require('./auth');
const userRouter = require('./users');
const courseRouter = require('./courses');
const lessonRouter = require('./lessons');
const enrollmentRouter = require('./enrollments');
const progressRouter = require('./progress');
const reviewRouter = require('./reviews');
const orderRouter = require('./orders');
const cartRouter = require('./cart');
const questionRouter = require('./questions');
const offlineScheduleRouter  = require('./offlineSchedule');
const speakingResultRouter = require('./speakingResults');
const testSessionRouter = require('./testSessions');
const adminRouter = require('./admin');

function route(app) {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/courses', courseRouter);
  app.use('/api/v1/lessons', lessonRouter);
  app.use('/api/v1/enrollments', enrollmentRouter);
  app.use('/api/v1/progress', progressRouter);
  app.use('/api/v1/reviews', reviewRouter);
  app.use('/api/v1/orders', orderRouter);
  app.use('/api/v1/cart', cartRouter);
  app.use('/api/v1/questions', questionRouter);
  app.use('/api/v1/offlineSchedule', offlineScheduleRouter);
  app.use('/api/v1/speakingResults', speakingResultRouter);
  app.use('/api/v1/testSessions', testSessionRouter);
  app.use('/api/v1/admin', adminRouter);

}

module.exports = route;

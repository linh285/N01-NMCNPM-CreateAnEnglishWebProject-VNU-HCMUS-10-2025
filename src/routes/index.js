
const express = require('express');

const authRouter = require('./auth');
const userRouter = require('./users');
const courseRouter = require('./courses');
const lessonRouter = require('./lessons');
const enrollmentRouter = require('./enrollments');

function route(app) {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/courses', courseRouter);
  app.use('/api/v1/lessons', lessonRouter);
  app.use('/api/v1/enrollments', enrollmentRouter);
}

module.exports = route;

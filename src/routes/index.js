
const express = require('express');

const authRouter = require('./auth');
const userRouter = require('./user');
const courseRouter = require('./course');

function route(app) {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/course', courseRouter);
}

module.exports = route;

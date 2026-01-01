const authRouter = require('./auth');


const express = require('express');
function route(app) {
  app.use('/api/v1/auth', authRouter);

}

module.exports = route;

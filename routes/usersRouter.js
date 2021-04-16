const express = require('express');
const usersRouter = express.Router();

usersRouter.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = usersRouter;

const express = require('express');

const partnersRouter = express.Router();

partnersRouter
  .route('/:partnerId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.send(req.params.partnerId);
  })
  .post((req, res) => {
    res.send('This is a post request');
  })
  .put((req, res) => {
    res.end(
      `Will add the partner: ${req.body.name} with description: ${req.body.description}`,
    );
  })
  .delete((req, res) => {
    res.send('This is a delete request');
  });

module.exports = partnersRouter;

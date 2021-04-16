const express = require('express');

const promotionsRouter = express.Router();

promotionsRouter
  .route('/:promotionId')
  .get((req, res) => {
    res.send(req.params.promotionId);
  })
  .post((req, res) => {
    res.send('This is a post request');
  })
  .put((req, res) => {
    res.send('This is a put request');
  })
  .delete((req, res) => {
    res.send('This is a delete request');
  });

module.exports = promotionsRouter;

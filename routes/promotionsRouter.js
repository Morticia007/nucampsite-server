const express = require('express');
const Promotions = require('../models/promotion');
const authenticate = require('../authenticate');

const promotionsRouter = express.Router();
const authMiddleware = [authenticate.verifyUser, authenticate.verifyAdmin];
promotionsRouter
  .route('/')
  .get((req, res, next) => {
    Promotions.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post(authMiddleware, (req, res, next) => {
    Promotions.create(req.body)
      .then((promotions) => {
        console.log('Promotions Created ', promotions);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.send('PUT operation not supported on /promotions');
  })
  .delete(authMiddleware, (req, res, next) => {
    Promotions.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

promotionsRouter
  .route('/:promotionId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.send(
      `POST operation not supported on /promotions/${req.params.promotionId}`,
    );
  })
  .put(authMiddleware, (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      { new: true },
    )
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .delete(authMiddleware, (req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = promotionsRouter;

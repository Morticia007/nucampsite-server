const express = require('express');
const Promotions = require('../models/promotion');
const authenticate = require('../authenticate');
const cors = require('./cors');

const promotionsRouter = express.Router();
const authMiddleware = [authenticate.verifyUser, authenticate.verifyAdmin];
promotionsRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Promotions.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authMiddleware, (req, res, next) => {
    Promotions.create(req.body)
      .then((promotions) => {
        console.log('Promotions Created ', promotions);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authMiddleware, (req, res) => {
    res.statusCode = 403;
    res.send('PUT operation not supported on /promotions');
  })
  .delete(cors.corsWithOptions, authMiddleware, (req, res, next) => {
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
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authMiddleware, (req, res) => {
    res.statusCode = 403;
    res.send(
      `POST operation not supported on /promotions/${req.params.promotionId}`,
    );
  })
  .put(cors.corsWithOptions, authMiddleware, (req, res, next) => {
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
  .delete(cors.corsWithOptions, authMiddleware, (req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = promotionsRouter;

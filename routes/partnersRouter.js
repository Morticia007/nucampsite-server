const express = require('express');
const Partners = require('../models/partner');
const authenticate = require('../authenticate');

const partnersRouter = express.Router();

const authMiddleware = [authenticate.verifyUser, authenticate.verifyAdmin];

partnersRouter
  .route('/')
  .get((req, res, next) => {
    Partners.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post(authMiddleware, (req, res, next) => {
    Partners.create(req.body)
      .then((partners) => {
        console.log('Partners Created ', partners);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
  })
  .delete(authMiddleware, (req, res, next) => {
    Partners.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

partnersRouter
  .route('/:partnerId')
  .get((req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`,
    );
  })
  .put(authMiddleware, (req, res, next) => {
    Partners.findByIdAndUpdate(
      req.params.partnerId,
      {
        $set: req.body,
      },
      { new: true },
    )
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .delete(authMiddleware, (req, res, next) => {
    Partners.findByIdAndDelete(req.params.partnerId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = partnersRouter;

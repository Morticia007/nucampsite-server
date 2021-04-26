const express = require('express');
const Partners = require('../models/partner');
const authenticate = require('../authenticate');
const cors = require('./cors');

const partnersRouter = express.Router();

const authMiddleware = [authenticate.verifyUser, authenticate.verifyAdmin];

partnersRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partners.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authMiddleware, (req, res, next) => {
    Partners.create(req.body)
      .then((partners) => {
        console.log('Partners Created ', partners);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authMiddleware, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
  })
  .delete(cors.corsWithOptions, authMiddleware, (req, res, next) => {
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
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authMiddleware, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`,
    );
  })
  .put(cors.corsWithOptions, authMiddleware, (req, res, next) => {
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
  .delete(cors.corsWithOptions, authMiddleware, (req, res, next) => {
    Partners.findByIdAndDelete(req.params.partnerId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = partnersRouter;

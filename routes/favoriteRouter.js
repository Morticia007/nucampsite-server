const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const User = require('../models/user');
const { response } = require('express');

const favoriteRouter = express.Router();
const authMiddleware = [authenticate.verifyUser, authenticate.verifyAdmin];

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('user')
      .populate('campsites')
      .then((favorites) => {
        console.log({
          line: 'line 19',
          method: 'Get /favorites',
          favorites,
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.user._id).then(function (user) {
      if (!user) {
        return res.status(401).send({
          statusCode: 401,
          message: 'No User Found',
        });
      }
      Favorite.create({
        campsites: req.body.campsites,
        user: req.user._id,
      })
        .then((favorite) =>
          res.send({
            favorite,
          }),
        )
        .catch((err) => next(err));
    });
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    function (req, res, next) {
      console.log({
        user: req.user,
      });
      Favorite.findOneAndDelete({
        user: req.user._id,
      }).then((favorites) => {
        console.log({ favorites });
        res.send({
          statusCode: 200,
          status: 'Deleted',
          message: `favorite deleted ${req.user.firstname} ${req.user.lastname}`,
          favorites,
        });
      });
    },
  );
favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('Get operation not supported on /favorites');
  })
  .post(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /favorites/${req.params.favoriteId}`,
    );
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete(req.params.favorite)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;

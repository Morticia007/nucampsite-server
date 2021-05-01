const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const User = require('../models/user');
const { response } = require('express');

const favoriteRouter = express.Router();
const authMiddleware = [authenticate.verifyUser, authenticate.verifyAdmin];

function findMatches(firstArray, defaultArray) {
  console.log({
    firstArray,
    defaultArray,
  });
  let sortedArray = [];
  let values = firstArray.map((item) => Object.values(item));
  values = values.flat();
  console.log({ values });
  values.map((first) => {
    sortedArray[defaultArray.findIndex((def) => def === first)] = first;
  });
  return sortedArray.filter((v) => v._id);
}

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
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    User.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        req.body.foreach((campsite) => {
          if (!favorite.campsites.includes(campsite._id)) {
            favorite.campsites.push(campsite._id);
          }
        });
        favorite.save().then((fav) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(fav);
        })
      } else {
        favorite
          .create({ user: req.user._id })
          .then((favorite) => {
            req.body.foreach((campsite) => {
              if (!favorite.campsites.includes(campsite._id)) {
                favorite.campsites.push(campsite._id);
              }
            });
            favorite.save().then((fav) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(fav);
            });
          })
          .catch((err) => next(err));
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })
  .delete(
    cors.corsWithOptions,authenticate.verifyUser, (req, res) => {
      Favorite.findOneAndDelete({ user: req.user._id}).then((response) => {
       if (response) {
          res.statusCode = 200,
          res.setHeader('Content-Type', 'application/json');
          res.json(response); ('you do not have any favorites to delete')
       } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end(fav); ('you do not have any favorites to delete')
       }
        })
        .catch(err => next (err))
      })
 
favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('Get operation not supported on /favorites');
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    User.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        req.body.foreach((campsite) => {
          if (!favorite.campsites.includes(campsite._id)) {
            favorite.campsites.push(campsite._id);
          }
        });
        favorite.save().then((fav) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(fav);
        })
      } else {
        favorite
          .create({ user: req.user._id })
          .then((favorite) => {
            req.body.foreach((campsite) => {
              if (!favorite.campsites.includes(campsite._id)) {
                favorite.campsites.push(campsite._id);
              }
            });
            favorite.save().then((fav) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(fav);
            });
          })
          .catch((err) => next(err));
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id}).then(favorite => {
      if (favorite) {
        const index = favorite.campsites.indexOf(req.params.campsiteId)
        if (index >= 0) {
          favorite.campsites.splice(index, 1)
        }
        favorite.save().then (fav => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(fav);
        })
      } else {
        favorite.save().then (fav => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain')
          res.end('you do not have any favorites to delete')
        }
      })
    })
     
      
    
module.exports = favoriteRouter;

const express = require('express');
const Promotions = require('../models/promotion');

const promotionsRouter = express.Router();

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
  .post((req, res, next) => {
    Promotions.create(req.body)
      .then((promotions) => {
        console.log('Promotions Created ', promotions);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.send('PUT operation not supported on /promotions');
  })
  .delete((req, res, next) => {
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
  .post((req, res) => {
    res.statusCode = 403;
    res.send(
      `POST operation not supported on /promotions/${req.params.promotionId}`,
    );
  })
  .put((req, res, next) => {
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
  .delete((req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });
promotionsRouter
  .route('/:promotionId/comments')
  .get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((promotions) => {
        if (promotions) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promotions.comments);
        } else {
          err = new Error(`Promotions ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((promotions) => {
        if (promotions) {
          promotions.comments.push(req.body);
          promotions
            .save()
            .then((promotions) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promotions);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Promotions ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.send(
      `PUT operation not supported on /promotions/${req.params.promotionId}/comments`,
    );
  })
  .delete((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((promotions) => {
        if (promotions) {
          for (let i = promotions.comments.length - 1; i >= 0; i--) {
            promotions.comments.id(promotions.comments[i]._id).remove();
          }
          promotions
            .save()
            .then((promotions) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promotions);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Promotions ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

promotionsRouter
  .route('/:promotionId/comments/:commentId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((promotions) => {
        if (promotions && promotions.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promotions.comments.id(req.params.commentId));
        } else if (!promotions) {
          err = new Error(`Promotions ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.send(
      `POST operation not supported on /promotions/${req.params.promotionId}/comments/${req.params.commentId}`,
    );
  })
  .put((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((promotions) => {
        if (promotions && promotions.comments.id(req.params.commentId)) {
          if (req.body.rating) {
            promotions.comments.id(req.params.commentId).rating =
              req.body.rating;
          }
          if (req.body.text) {
            promotions.comments.id(req.params.commentId).text = req.body.text;
          }
          promotions
            .save()
            .then((promotions) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promotions);
            })
            .catch((err) => next(err));
        } else if (!promotions) {
          err = new Error(`Promotions ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((promotions) => {
        if (promotions && promotions.comments.id(req.params.commentId)) {
          promotions.comments.id(req.params.commentId).remove();
          promotions
            .save()
            .then((promotions) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promotions);
            })
            .catch((err) => next(err));
        } else if (!promotions) {
          err = new Error(`promotions ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = promotionsRouter;

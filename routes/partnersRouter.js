const express = require('express');
const Partners = require('../models/partner');

const partnersRouter = express.Router();

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
  .post((req, res, next) => {
    Partners.create(req.body)
      .then((partners) => {
        console.log('Partners Created ', partners);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
  })
  .delete((req, res, next) => {
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
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`,
    );
  })
  .put((req, res, next) => {
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
  .delete((req, res, next) => {
    Partners.findByIdAndDelete(req.params.partnerId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });
partnersRouter
  .route('/:partnerId/comments')
  .get((req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then((partners) => {
        if (partners) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(partners.comments);
        } else {
          err = new Error(`Partners ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then((partners) => {
        if (partners) {
          partners.comments.push(req.body);
          partners
            .save()
            .then((partners) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(partners);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Partners ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.send(
      `PUT operation not supported on /partners/${req.params.partnerId}/comments`,
    );
  })
  .delete((req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then((partners) => {
        if (partners) {
          for (let i = partners.comments.length - 1; i >= 0; i--) {
            partners.comments.id(partners.comments[i]._id).remove();
          }
          partners
            .save()
            .then((partners) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(partners);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Partners ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

partnersRouter
  .route('/:partnerId/comments/:commentId')
  .get((req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then((partners) => {
        if (partners && partners.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(partners.comments.id(req.params.commentId));
        } else if (!partners) {
          err = new Error(`Partners ${req.params.partnerId} not found`);
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
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}/comments/${req.params.commentId}`,
    );
  })
  .put((req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then((partners) => {
        if (partners && partners.comments.id(req.params.commentId)) {
          if (req.body.rating) {
            partners.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.text) {
            partners.comments.id(req.params.commentId).text = req.body.text;
          }
          partners
            .save()
            .then((partners) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(partners);
            })
            .catch((err) => next(err));
        } else if (!partners) {
          err = new Error(`Partners ${req.params.partnerId} not found`);
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
    Partners.findById(req.params.partnerId)
      .then((partners) => {
        if (partners && partners.comments.id(req.params.commentId)) {
          partners.comments.id(req.params.commentId).remove();
          partners
            .save()
            .then((partners) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(partners);
            })
            .catch((err) => next(err));
        } else if (!partners) {
          err = new Error(`Partners ${req.params.partnerId} not found`);
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

module.exports = partnersRouter;

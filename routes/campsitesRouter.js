const express = require('express');
const campsitesRouter = express.Router();

// when we go to localhost:3000/campsites use line 7 - 30
campsitesRouter
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end('Will send all the campsites to you');
  })
  .post((req, res) => {
    console.log('its showing up');
    console.log('working?');
    res.end(
      `Will add the campsite: ${req.body.name} with description: ${req.body.description}`,
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
  })
  .delete((req, res) => {
    res.end('Deleting all campsites');
  });

campsitesRouter
  .route('/:campsiteId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.send(req.params.campsiteId);
  })
  .post((req, res) => {
    res.send('This is a post request');
  })
  .put((req, res) => {
    res.end(
      `Will add the campsite: ${req.body.name} with description: ${req.body.description}`,
    );
  })
  .delete((req, res) => {
    res.send('This is a delete request');
  });

module.exports = campsitesRouter;

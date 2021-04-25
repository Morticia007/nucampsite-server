const express = require('express');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const authenticate = require('./authenticate');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const campsitesRouter = require('./routes/campsitesRouter');
const promotionsRouter = require('./routes/promotionsRouter');
const partnersRouter = require('./routes/partnersRouter');

const FileStore = require('session-file-store')(session);
const mongoose = require('mongoose');
const config = require('./config');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

connect.then(
  () => console.log('Connected correctly to server'),
  (err) => console.log(err),
);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsitesRouter);
app.use('/promotions', promotionsRouter);
app.use('/partners', partnersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send({
    line: 68,
    status: err.status,
    message: 'Caught by the error handling middleware',
    err,
  });
});

module.exports = app;

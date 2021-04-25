const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const config = require('./config.js');

exports.getToken = function (user) {
  console.log({
    line: '11',
    method: 'getToken',
    file: 'authenticate.js',
    user,
    secret: config.secretKey,
  });
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT payload:', jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      console.log('line 28');
      if (err) {
        console.log('line 30', err);
        return done(err, false);
      } else if (user) {
        console.log('line 33', user);
        return done(null, user);
      } else {
        console.log('line 36');
        return done(null, false);
      }
    });
  }),
);

exports.verifyAdmin = (req, res, next) => {
  if (!req.user.admin) {
    const err = {
      code: 'Unauthorized',
      status: 403,
      message: 'You are not authorized to perform this operation!',
    };
    next(err);
  }
  next();
};

exports.verifyUser = passport.authenticate('jwt', { session: false });

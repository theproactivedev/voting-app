const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
// const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
// const methodOverride = require('method-override');
const cors = require('cors');
// const TwitterStrategy = require('passport-twitter').Strategy;
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var router = express.Router();
var request = require('request');

require('dotenv').config();
var db = "mongodb://admin_eirin:v0t!n6%40ppp0ll$@ds039504.mlab.com:39504/polls";
mongoose.connect(db);
//mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/polls");

var routes = require('./app/routes/app.js');
var Users = require("./app/models/Users.js");
var Polls = require("./app/models/Polls.js");


var configAuth = require("./app/config/auth.js");
require('./app/config/passport.js')(passport);
var app = express();

// Users.remove({}, function(err) {
//   if (err) console.log(err);
// });
//
// Polls.remove({}, function(err) {
//   if (err) console.log(err);
// });

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cookieParser());
// app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'votingApp',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use('/public', express.static(process.cwd() + '/public'));


// MongoClient.connect(dbLink, {
//     uri_decode_auth: true }, function(err, db) {
//   db.createCollection("polls", {
//     capped: false,
//     size: 5242880,
//     max: 5000
//   });
//
// });

var createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  });
};

var generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
};

router.route('/auth/twitter/reverse')
  .post(function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: configAuth.twitterAuth.consumerKey,
        consumer_secret: configAuth.twitterAuth.consumerSecret
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }

      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    });
  });

router.route('/auth/twitter')
  .post((req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: configAuth.twitterAuth.consumerKey,
        consumer_secret: configAuth.twitterAuth.consumerSecret,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }

      console.log(body);
      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      next();
    });
  }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }

      // prepare token for API
      req.auth = {
        id: req.user.id
      };

      console.log("Req user id" + req.user.id);

      return next();
    }, generateToken, sendToken);

//token handling middleware
var authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

var getCurrentUser = function(req, res, next) {
  Users.findById(req.auth.id, function(err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};
//
// var getOne = function (req, res) {
//   var user = req.user.toObject();
//
//   delete user['twitterProvider'];
//   delete user['__v'];
//
//   res.json(user);
// };

// router.route('/auth/me')
//   .get(authenticate, getCurrentUser, getOne);

app.use('/api/v1', router);

routes(app, passport);

app.route("/me").get(function(req, res) {
  // if (req.user) {
  //   res.json(req.user);
  // } else {
  //   res.json({
  //     "message" : "undefined"
  //   });
  // }
  res.send("Hello");
});

app.route('/logout').get(function(req, res){
  req.logout();
  res.redirect("http://localhost:3000/polls");
  console.log("Logging Out");
});

app.listen(3001, function() {
	console.log("Working");
});

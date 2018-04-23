var Polls = require("../models/Polls");
var Users = require("../models/Users");
var path = require("path");
var express = require("express");
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var request = require('request');
var configAuth = require("../config/auth.js");

module.exports = function(app, passport) {

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

  var authenticate = expressJwt({
    secret: 'my-secret',
    requestProperty: 'auth',
    getToken: function(req) {
      if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
      } else {
        console.log("No token");
      }
      return null;
    }
  });

  var getCurrentUser = function(req, res, next) {
    Users.findOne({
      "_id" : req.auth.id
    }, function(err, user) {
      if (err) {
        next(err);
      } else {
        req.user = user;
        next();
      }
    });
  };

  router.route('/auth/twitter/reverse')
    .post(function(req, res) {
      request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: "http://localhost:3000/twitter-callback",
          consumer_key: configAuth.twitterAuth.consumerKey,
          consumer_secret: configAuth.twitterAuth.consumerSecret
        }
      }, function (err, r, body) {
        if (err) {
          return res.status(500).send({ message: err.message });
        }

        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      });
    });

  router.route('/auth/twitter')
    .post((req, res, next) => {
      request.post({
        url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
        oauth: {
          consumer_key: configAuth.twitterAuth.consumerKey,
          consumer_secret: configAuth.twitterAuth.consumerSecret,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, function (err, r, body) {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);
        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        next();
      });
    }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
        if (!req.user) {
          return res.status(401).send("User Not Authenticated");
        }

        // prepare token for API
        req.auth = {
          id: req.user.id
        };

        return next();
      }, generateToken, sendToken);


  app.route("/polls").get(function(req, res) {
  	Polls.find({}, function(err, data) {
  		if (err) {
  			console.log(err);
  		}

  		if(data) {
  			res.json(data);
  		} else {
  			console.log("Polls undefined");
  		}
  	});
  });

  app.route("/myPolls").get(authenticate, getCurrentUser,
    function(req, res) {
      console.log("Req.auth.id: " + req.auth.id);
    Polls.find({
      "authorID" : req.auth.id
    }, function(err, data) {
      if (err) {
        console.log(err);
      }

      if (data) {
        res.json(data);
      }
    });
  });

  app.route("/newPoll").post(authenticate, getCurrentUser,
    function(req, res) {
    if (typeof req.body === undefined) {
      console.log("New Poll undefined");
    } else {
    	var choices = req.body.options.split(",");
    	var list = choices.map(function(oneChoice) {
    		return {choice: oneChoice.trim(), vote: 0};
    	});

    	var poll = new Polls({
    		question: req.body.question,
    		options: list,
        totalVotes: 0,
        authorID: req.auth.id,
        twitterID: req.body.twitterId
    	});

    	poll.save(function(err) {
    		if (err) {
    			console.log(err);
    		}
    	});

    }
  });

  app.route("/polls/:item").get(function(req, res) {
    Polls.findOne({
      question: req.params.item + "?"
    }, function(err, data) {
      if (err) {
        console.log(err);
      }

      if (data) {
        res.json(data);
      }
    });
  });

  app.route("/polls/:item").post(function(req, res) {
    if (typeof req.body === undefined) {
      console.log("Req.Body is undefined");
    } else {
      Polls.findOneAndUpdate(
        { "question": req.params.item + "?",
          "options.choice" : req.body.choice },
        { $inc : {totalVotes : 1, "options.$.vote" : 1 } },
        function(err, data) {
          if (err) {
            console.log(err);
          }

          if (!data) {
            var obj = {
              choice: req.body.choice,
              vote: 1
            };
            Polls.findOneAndUpdate(
              {"question": req.params.item + "?"},
              {$push : { "options": obj } },
              {upsert: true, new: true},
              function(err) {
                if (err) console.log(err);
              }
            );
          }
        }
      );
    }
  });

  app.route("/polls/:item").delete(function(req, res) {
    if (typeof req.body === undefined) {
      console.log("Req.Body is undefined");
    } else {

      Polls.remove({"question" : req.params.item + "?"}, function(err) {
        console.log(err);
      });
      res.redirect("/polls");
    }
  });

  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname + '/client/build/index.html'));
  // });

  app.use('/api/v1', router);

};

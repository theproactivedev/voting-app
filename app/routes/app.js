var Polls = require("../models/Polls");
var Users = require("../models/Users");
require("../config/passport.js");
var path = require("path");
var express = require("express");
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var request = require('request');
var configAuth = require("../config/auth.js");
const fs = require("fs");
const privateKey = fs.readFileSync('app/config/private.key', 'utf8');
const publicKey = fs.readFileSync('app/config/public.key', 'utf8');

module.exports = function(app, passport) {
  var createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    }, privateKey, { algorithm: 'RS256' },
    {
      expiresIn: '7d'
    });
  };

  var generateToken = function (req, res, next) {
    console.log("Generate Token");
    req.token = createToken(req.auth);
    return next();
  };
  
  const saveTokenInCookie = (req, res, next) => {
    res.cookie("jawbtc", req.token, { maxAge: 600000000, httpOnly: true });
    return next();
  }

  var sendToken = function (req, res, next) {
    res.setHeader('x-auth-token', req.token);
    return next();
  };

  let sendTokenUsingTwitter = (req, res) => res.status(200).send(JSON.stringify(req.user));
  let sendTokenUsingLocal = (req, res) => res.status(200).json(req.user);

  var authenticate = expressJwt({
    secret: publicKey,
    algorithms: [ 'RS256' ],
    requestProperty: 'auth',
    getToken: function(req) {
      if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
      } else if (req.cookies["jawbtc"]) { 
        return req.cookies["jawbtc"];
        
      } else {
        console.log("No token");
        return new Error("Please sign out and log in again.");
      }
    }
  });
  const clearTokenFromCookie = (req, res, next) => {
    res.clearCookie("jawbtc");
    return next();
  }

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
          oauth_callback: "https://eg-fcc-votingapp.herokuapp.com/twitter-callback",
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
        if (!req.user) return res.status(401).send("User Not Authenticated");
        
        req.auth = {
          id: req.user.id
        };

        return next();
      }, generateToken, saveTokenInCookie, sendToken, sendTokenUsingTwitter);

  app.post('/signup', function(req, res, next) {
    const { body: { user } } = req;

    passport.authenticate('local-signup', { session:false }, function(err, user, info) {
      if (!user) return res.status(401).send("User Not Authenticated");

      req.auth = {
        id: user.id
      };

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        console.log(user);
      });
      return next();
    })(req, res, next);
  }, generateToken, saveTokenInCookie, sendToken, sendTokenUsingLocal);

  
  app.post('/login', function(req, res, next) {
    const { body: { user } } = req;

    passport.authenticate('login', { session:false }, function(err, user, info) {
      console.log(info);
      if (!user) return res.status(401).send("User Not Authenticated");
      console.log(user.local.email + " email");
      req.auth = {
        id: user.id
      };

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        console.log(user);
      });
      return next();
    })(req, res, next);
  }, generateToken, saveTokenInCookie, sendToken, sendTokenUsingLocal);

  app.route("/logout").get(clearTokenFromCookie, function(req, res) {
    console.log(req.cookies["jawbtc"]);
    return res.redirect("/");
  });

  app.route("/profile").get(authenticate, getCurrentUser, function(req,res) {
    console.log("Did it reach here?");
    console.log(typeof req.user);
    console.log(req.user);
    if (req.user != undefined) {
    console.log("How about here?");

      console.log(req.user);
      res.json(req.user);
    }
  });

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

  app.route("/polls/:item").delete(authenticate, getCurrentUser, function(req, res) {
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

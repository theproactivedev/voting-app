const Polls = require("../models/Polls");
const Users = require("../models/Users");
require("../config/passport.js");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const request = require("request");
const configAuth = require("../config/auth.js");
const fs = require("fs");
const privateKey = fs.readFileSync("app/config/private.key", "utf8");
const publicKey = fs.readFileSync("app/config/public.key", "utf8");
const path = require("path");

module.exports = function(app, passport) {

  app.use("/api/v1", router);

  const createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    }, privateKey, { algorithm: "RS256" },
    {
      expiresIn: "7d"
    });
  };

  const generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  };
  
  const saveTokenInCookie = (req, res, next) => {
    res.cookie("jawbtc", req.token, { maxAge: 600000000, httpOnly: false });
    return next();
  }

  const sendUserUsingTwitter = (req, res) => res.status(200).send(JSON.stringify(req.user));
  const sendUserUsingLocal = (req, res) => res.status(200).json(req.user);

  const authenticate = expressJwt({
    secret: publicKey,
    algorithms: [ "RS256" ],
    requestProperty: "auth",
    getToken: function(req) {
      if (req.cookies["jawbtc"]) { 
        return req.cookies["jawbtc"];
      }
    }
  });

  const handleJWTError = (err, req, res, next) => {
    if(err.name === "UnauthorizedError") {
      return res.status(401).send("Unauthorized Access. Sign up or log in first.");        
    }
    return next();
  };

  const clearTokenFromCookie = (req, res) => {
    res.clearCookie("jawbtc");
    return res.end();
  };

  const getCurrentUser = function(req, res, next) {
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

  router.route("/auth/twitter/reverse")
    .post(function(req, res) {
      request.post({
        url: "https://api.twitter.com/oauth/request_token",
        oauth: {
          oauth_callback: "https://eg-fcc-votingapp.herokuapp.com/twitter-callback",
          consumerKey: configAuth.twitterAuth.consumerKey,
          consumerSecret: configAuth.twitterAuth.consumerSecret
        }
      }, function (err, r, body) {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        
        // let jsonStr = "{ '" + body.replace(/&/g, "', '").replace(/=/g, "': '") + "'}";
        let jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      });
    });

  router.route("/auth/twitter")
    .post((req, res, next) => {
      request.post({
        url: "https://api.twitter.com/oauth/access_token?oauth_verifier",
        oauth: {
          consumerKey: configAuth.twitterAuth.consumerKey,
          consumerSecret: configAuth.twitterAuth.consumerSecret,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, function (err, r, body) {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        // let bodyString = "{ '" + body.replace(/&/g, "', '").replace(/=/g, "': '") + "'}";
        let bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        let parsedBody = JSON.parse(bodyString);
        req.body["oauth_token"] = parsedBody.oauth_token;
        req.body["oauth_token_secret"] = parsedBody.oauth_token_secret;
        req.body["user_id"] = parsedBody.user_id;

        next();
      });
    }, passport.authenticate("twitter-token", {session: false}), function(req, res, next) {
        if (!req.user) return res.status(401).send("User Not Authenticated");
        
        req.auth = {
          id: req.user.id
        };

        return next();
      }, generateToken, saveTokenInCookie, sendUserUsingTwitter);

  router.post("/signup", function(req, res, next) {
    const { body: { user } } = req;

    passport.authenticate("local-signup", { session:false }, function(err, user, info) {
      if (!user) return res.status(401).send(info.message);

      req.auth = {
        id: user.id
      };

      req.logIn(user, function(err) {
        if (err) { return next(err); }
      });
      return next();
    })(req, res, next);
  }, generateToken, saveTokenInCookie, sendUserUsingLocal);

  
  router.post("/login", function(req, res, next) {
    const { body: { user } } = req;

    passport.authenticate("login", { session:false }, function(err, user, info) {
      if (!user) return res.status(401).send(info.message);

      req.auth = {
        id: user.id
      };

      req.logIn(user, function(err) {
        if (err) { return next(err); }
      });
      return next();
    })(req, res, next);
  }, generateToken, saveTokenInCookie, sendUserUsingLocal);

  router.route("/logout").get(authenticate, getCurrentUser, clearTokenFromCookie);

  router.route("/polls").get(function(req, res) {
  	Polls.find({}, function(err, data) {
  		if (err) {
        console.log(err);
        return res.redirect("/");
  		}

  		if(data) {
  			res.json(data);
  		} else {
  			console.log("Polls undefined");
  		}
  	});
  });

  router.route("/myPolls").post(authenticate, handleJWTError, getCurrentUser, function(req, res) {
    Polls.find({
      "authorID" : req.body.username
    }, function(err, data) {
      if (err) return console.log(err);
      if (data) {
        res.json(data);
      }
    });
  });

  router.route("/newPoll").post(authenticate, handleJWTError, getCurrentUser, function(req, res) {
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
        authorID: req.body.author
    	});

    	poll.save(function(err) {
    		if (err) {
    			console.log(err);
    		}
    	});

    }
  });

  router.route("/polls/:item").get(function(req, res) {
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

  router.route("/polls/:item").post(function(req, res) {
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

  router.route("/polls/:item").delete(authenticate, getCurrentUser, function(req, res) {
    if (typeof req.body === undefined) {
      console.log("Req.Body is undefined");
    } else {

      Polls.remove({"question" : req.params.item + "?"}, function(err) {
        console.log(err);
      });
      res.redirect("/myPolls");
    }
  });


  app.get("*", (req, res) => {
    return res.sendFile(path.resolve("./client/build/index.html"));
  });


};

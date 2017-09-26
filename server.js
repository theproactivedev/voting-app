const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const polls = require("./models/polls");
const bodyParser = require("body-parser");
const MongoClient = mongodb.MongoClient;
const path = require('path');
const passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/public')));

// app.use(express.cookieParser());
// app.use(express.session({secret: 'mysecret'}));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new GithubStrategy({
//   clientID: process.env.GITHUB_KEY,
//   clientSecret: process.env.GITHUB_SECRET,
//   callbackURL: process.env.APP_URL
// }, function(accessToken, refreshToken, profile, done){
//   done(null, {
//     accessToken: accessToken,
//     profile: profile
//   });
// }));

// passport.serializeUser(function(user, done) {
  // for the time being tou can serialize the user
  // object {accessToken: accessToken, profile: profile }
  // In the real app you might be storing on the id like user.profile.id
  // done(null, user);
// });

// passport.deserializeUser(function(user, done) {
  // If you are storing the whole user on session we can just pass to the done method,
  // But if you are storing the user id you need to query your db and get the user
  //object and pass to done()
  // done(null, user);
// });

var db = "mongodb://admin_eirin:v0t!n6%40ppp0ll$@ds039504.mlab.com:39504/polls";
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/polls");

// MongoClient.connect(dbLink, {
//     uri_decode_auth: true }, function(err, db) {
//   db.createCollection("polls", {
//     capped: false,
//     size: 5242880,
//     max: 5000
//   });
//
// });

mongoose.connect(db);

// var test = new polls({
// 	question: "What is your favorite pet?",
// 	options: ["cat", "dog", "fish", "birds"]
// });
//
// test.save(function (err, test) {
//     console.log("saved?")
//     if (err) {
//       console.log("error");
//       return console.error(err);
//     }
//     console.log("saved!")
//   });
//   console.log("after save");

app.route("/")
.get(function(req, res) {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

app.route("/polls").get(function(req, res) {
	polls.find({}, function(err, data) {

		if (err) {
			console.log(err);
		}

		if(data) {
			res.json(data);
			console.log("contains something");
		} else {
			console.log("undefined");
		}

	});
});

app.route("/public/newPoll/").post(function(req, res) {
  if (typeof req.body === undefined) {
    console.log("undefined");
  } else {
    console.log(req.body.question);
  }

	var choices = req.body.options.split(",");
	var list = choices.map(function(oneChoice) {
		return {choice: oneChoice.trim(), vote: 0};
	});


	var poll = new polls({
		question: req.body.question,
		options: list,
    totalVotes: 0
	});

	poll.save(function(err) {
		if (err) {
			console.log(err);
		}
	});
	console.log("Success");

});

app.route("/polls/:item").get(function(req, res) {
  console.log("Req Params: " + req.params.item);

  polls.findOne({
    question: req.params.item + "?"
  }, function(err, data) {
    if (err) {
      console.log(err);
    }

    if (data) {
      res.json(data);
    } else {
      res.send("Hello");
    }
  });
});

app.route("/polls/:item").post(function(req, res) {
  if (typeof req.body === undefined) {
    console.log("Req.Body is undefined");
  } else {
    console.log("Choice: " + req.body.choice);

    polls.findOneAndUpdate(
      { "question": req.params.item + "?",
        "options.choice" : req.body.choice },
      { $inc : {totalVotes : 1, "options.$.vote" : 1} } ,
      function(err) {
        if (err) console.log(err);
      }
    );
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

app.listen(process.env.PORT || 3001, function() {
	console.log("Working");
});

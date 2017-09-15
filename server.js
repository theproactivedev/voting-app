const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const polls = require("./models/polls");
const bodyParser = require("body-parser");
const MongoClient = mongodb.MongoClient;
const path = require('path');
//var passport = require("passport");
//var session = require("express-session");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/public')));

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

app.get("/polls", function(req, res) {
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

app.route("/public/newPoll/processing-poll")
.post(function(req, res) {
  if (typeof req.body === undefined) {
    console.log("undefined");
  } else {
    console.log(req.body.question);
  }

	var choices = req.body.options.split(",");
	var list = choices.map(function(choice) {
		return choice.trim();
	});


	var poll = new polls({
		question: req.body.question,
		options: list
	});

	poll.save(function(err) {
		if (err) {
			console.log(err);
		}
	});
	console.log("Success");

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

app.listen(process.env.PORT || 3000, function() {
	console.log("Working");
});

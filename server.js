var express = require("express");
var mongoose = require("mongoose");
var mongodb = require("mongodb");
var polls = require("./models/polls");
var bodyParser = require("body-parser");
var MongoClient = mongodb.MongoClient;
//var passport = require("passport");
//var session = require("express-session");
//
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var dbLink = "mongodb://admin_eirin:v0t!n6%40pp@ds157320.mlab.com:57320/voting-app";
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/polls");

MongoClient.connect(dbLink, { 
    uri_decode_auth: true }, function(err, db) {
  db.createCollection("polls", {
    capped: true,
    size: 5242880,
    max: 5000
  });
  
});

mongoose.connect(dbLink);

var test = new polls({
	question: "What is your favorite pet?",
	options: ["cat", "dog", "fish", "birds"]
});

test.save(function (err, test) {
    console.log("saved?")
    if (err) {
      console.log("error");
      return console.error(err);
    }
    console.log("saved!")
  });
  console.log("after save");

app.route("/")
.get(function(req, res) {
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
	var choices = req.body.choices.split(",");
	var list = choices.map(function(choice) {
		return choice.trim();
	});
	
	
	var poll = new polls({
		question: req.body.query,
		options: list
	});
	
	poll.save(function(err) {
		if (err) {
			console.log(err);
		}
	});
	console.log("Success");
	
//	res.redirect("/");
});

app.listen(process.env.PORT || 3001, function() {
	console.log("Working");
});
var express = require("express");
var mongoose = require("mongoose");
var polls = require("./models/polls");

var app = express();

app.route("/")
.get(function(req, res) {
	polls.find({}, function(err, data) {
		res.json(data);
	});
});

app.listen(process.env.PORT || 3001, function() {
	console.log("Working");
});
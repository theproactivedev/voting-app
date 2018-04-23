// ,
// "heroku-postbuild": "cd client && npm install --only=dev && npm install && npm run build"

const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

var routes = require('./app/routes/app.js');
// var Users = require("./app/models/Users.js");
// var Polls = require("./app/models/Polls.js");

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
app.use(express.static(path.join(__dirname, 'client/public')));
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(session({
//   secret: 'votingApp',
//   resave: true,
//   saveUninitialized: true
// }));
app.use(passport.initialize());
// app.use(passport.session());

routes(app, passport);

app.listen(process.env.PORT || 3001, function() {
	console.log("Working");
});

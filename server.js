const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const TwitterStrategy = require('passport-twitter').Strategy;

var routes = require('./app/routes/app.js');
var app = express();

// require('dotenv').config();
// require('dotenv').load();
// console.log(process.env.APP_URL);
app.use(cors({ credentials: true}));

// require('./app/config/passport.js')(passport);
var configAuth = require('./app/config/auth');

passport.use(new TwitterStrategy({
  consumerKey: configAuth.twitterAuth.consumerKey,
  consumerSecret: configAuth.twitterAuth.consumerSecret,
  callbackURL: configAuth.twitterAuth.callbackURL
},
function(token, tokenSecret, profile, done) {
  process.nextTick(function() {
    var searchQuery = {
      name: profile.displayName
    };

    var updates = {
      displayName: profile.displayName,
      id: profile.id
    };

    var options = {
      upsert: true
    };

    Users.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });

  }); // process.nextTick
} // function wrapper
)); // passport use

passport.serializeUser(function (user, done) {
  console.log("Serialize");
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("Deserialize");
  Users.findById(id, function (err, user) {
    done(err, user);
  });
});




app.use(express.static(path.join(__dirname, 'client/public')));
app.use(cookieParser());
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'votingApp',
  resave: true,
  saveUninitialized: true,
  key: 'sid'
}));
app.use(passport.initialize());
app.use(passport.session());

var db = "mongodb://admin_eirin:v0t!n6%40ppp0ll$@ds039504.mlab.com:39504/polls";
mongoose.connect(db);
//mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/polls");

// MongoClient.connect(dbLink, {
//     uri_decode_auth: true }, function(err, db) {
//   db.createCollection("polls", {
//     capped: false,
//     size: 5242880,
//     max: 5000
//   });
//
// });

routes(app, passport);

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/polls');
});

app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT || 3001, function() {
	console.log("Working");
});

'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var Users = require('../models/Users');
var configAuth = require('./auth');

module.exports = function (passport) {

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

};

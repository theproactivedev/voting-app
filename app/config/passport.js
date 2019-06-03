"use strict";

var TwitterTokenStrategy = require("passport-twitter-token");
var LocalStrategy    = require("passport-local").Strategy;
var Users = require("../models/Users");
var configAuth = require("./auth");

module.exports = function (passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		Users.findById(id, function(err, user) {
				done(err, user);
		});
	});

	passport.use("twitter-token", new TwitterTokenStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret
	},
	function (token, tokenSecret, profile, done) {
		Users.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
			return done(err, user);
		});
	}));

	passport.use("local-signup", new LocalStrategy({
		usernameField : "email",
		passwordField : "password",
		passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			Users.findOne({"local.email": email}, function(err, existingUser) {
				if (err) return done(err);

				if (existingUser) return done(null, false, { message: "That email is already taken."});

				if(req.user) {
					var user            = req.user;
					user.local.email    = email;
					user.local.password = user.generateHash(password);
					user.save(function(err) {
						if (err) throw err;
						return done(null, user);
					});
				} else {
					var newUser            = new Users();
					newUser.local.email    = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.save(function(err) {
						if (err)throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use("login", new LocalStrategy({
			usernameField : "email",
			passwordField : "password"
	}, async (email, password, done) => {
	try {
			const user = await Users.findOne({ "local.email" : email });
			if( !user ) return done(null, false, { message : "User not found. Please create an account first."});

			const validate = await user.isValidPassword(password);
			if( !validate ) return done(null, false, { message : "Email address and/or password combination is invalid. Please try again."});
			
			return done(null, user, { message : "Logged in Successfully"});
	} catch (error) {
			return done(error);
	}
	}));
};

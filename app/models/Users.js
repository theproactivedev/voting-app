'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new Schema({
  twitter: {
    type: {
      username: String,
      id: String,
      token: String,
      tokenSecret: String
    }
  },
  local: {
    email: String,
    password: String,
  }
});

UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
  var that = this;
  
  return this.findOne({ "twitter.id" : profile.id }, function(err, user) { 
    if (!user) {
      var newUser = new that({
        twitter: {
          username: profile.displayName,
          id: profile.id,
          token: token,
          tokenSecret: tokenSecret
        }
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('Users', UserSchema);

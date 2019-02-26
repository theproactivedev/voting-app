'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new Schema({
  twitterProvider: {
    type: {
      name: String,
      identification: String,
      token: String,
      tokenSecret: String
    }
  },
  local: {
    email: String,
    hash: String,
    salt: String,
    password: String,
  }
});

UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
  var that = this;

  return this.findOne({
    'twitterProvider.identification': profile.id
  }, function(err, user) {
    if (!user) {
      var newUser = new that({
        twitterProvider: {
          name: profile.displayName,
          identification: profile.id,
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

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('Users', UserSchema);

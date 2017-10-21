'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  twitterProvider: {
    type: {
      name: String,
      identification: String,
      token: String,
      tokenSecret: String
    },
    select: false
  }
});

UserSchema.set('toJSON', {getters: true, virtuals: true});

UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
  var that = this;

  return this.findOne({
    'twitterProvider.id': profile.id
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

module.exports = mongoose.model('Users', UserSchema);

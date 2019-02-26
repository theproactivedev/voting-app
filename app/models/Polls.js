'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionsSchema = new Schema({
  choice: String,
  vote: Number
});

var PollSchema = new Schema({
    question : String,
    options : [OptionsSchema],
    totalVotes : Number,
    authorID: String,
    twitterID: String,
    postDate: { type: Date, default: Date.now }
});

// database name, name of schema
module.exports = mongoose.model('Polls', PollSchema);

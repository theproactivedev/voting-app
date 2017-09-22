'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionsSchema = new Schema({
  choice: String,
  vote: Number
});

var pollSchema = new Schema({
    question : String,
    options : [optionsSchema],
    totalVotes : Number
});

// database name, name of schema
module.exports = mongoose.model('polls', pollSchema);

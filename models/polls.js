'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
    question : String,
    options : [String]
});

// database name, name of schema
module.exports = mongoose.model('polls', pollSchema);

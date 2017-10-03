'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
		id: String,
		displayName: String
});

module.exports = mongoose.model('Users', UserSchema);

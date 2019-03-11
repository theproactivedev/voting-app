const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
var app = express();
const helmet = require("helmet");

require('dotenv').config();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

var routes = require('./app/routes/app.js');
require('./app/config/passport.js')(passport);

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(helmet());

routes(app, passport);

app.listen(process.env.PORT || 3001, function() {
	console.log("Working");
});
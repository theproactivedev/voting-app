// ,
// "heroku-postbuild": "cd client && npm install --only=dev && npm install && npm run build"

const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const flash = require('connect-flash');
const morgan = require('morgan');
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
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, 'client/public')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(session({
//   name: "login-server-session-cookie-id",
//   genid: function(req) {
//     return genuuid() // use UUIDs for session IDs
//   },
//   secret: process.env.THE_KEY_TO_VOTE,
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     secure: false,
//     maxAge: 600000000,
//     httpOnly: false
// }
// }));
app.use(passport.initialize());
// app.use(passport.session());
app.use(helmet());
app.use(flash());

routes(app, passport);

app.listen(process.env.PORT || 3001, function() {
	console.log("Working");
});

var Polls = require("../models/Polls");
var Users = require("../models/Users");

module.exports = function(app, passport) {

  app.route("/isSomeoneLoggedIn")
  .get(function(req, res) {
    if (req.user != undefined) {
      res.json(req.user);
    } else {
      res.json({
        displayName: "",
        id: ""
      });
    }
  });

  app.route("/polls").get(function(req, res) {
  	Polls.find({}, function(err, data) {

  		if (err) {
  			console.log(err);
  		}

  		if(data) {
  			res.json(data);
  			console.log("contains something");
  		} else {
  			console.log("undefined");
  		}

  	});
  });

  app.route("/newPoll").post(function(req, res) {
    if (typeof req.body === undefined) {
      console.log("undefined");
    } else {
      console.log(req.body.question);
    }

  	var choices = req.body.options.split(",");
  	var list = choices.map(function(oneChoice) {
  		return {choice: oneChoice.trim(), vote: 0};
  	});


  	var poll = new Polls({
  		question: req.body.question,
  		options: list,
      totalVotes: 0
  	});

  	poll.save(function(err) {
  		if (err) {
  			console.log(err);
  		}
  	});
  	console.log("Success");

  });

  app.route("/polls/:item").get(function(req, res) {
    console.log("Req Params: " + req.params.item);

    Polls.findOne({
      question: req.params.item + "?"
    }, function(err, data) {
      if (err) {
        console.log(err);
      }

      if (data) {
        res.json(data);
      } else {
        res.send("Hello");
      }
    });
  });

  app.route("/polls/:item").post(function(req, res) {
    if (typeof req.body === undefined) {
      console.log("Req.Body is undefined");
    } else {
      console.log("Choice: " + req.body.choice);

      Polls.findOneAndUpdate(
        { "question": req.params.item + "?",
          "options.choice" : req.body.choice },
        { $inc : {totalVotes : 1, "options.$.vote" : 1} } ,
        function(err) {
          if (err) console.log(err);
        }
      );
    }
  });

  // app.get('*', function(req, res) {
  //   res.sendFile(process.cwd() + "/client/public/index.html");
  // });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }



};

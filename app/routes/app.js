var Polls = require("../models/Polls");
var Users = require("../models/Users");
var path = require("path");

module.exports = function(app, passport) {

  app.route("/polls").get(function(req, res) {
    	Polls.find({}, function(err, data) {

    		if (err) {
    			console.log(err);
    		}

    		if(data) {
    			res.json(data);
    		} else {
    			console.log("undefined");
    		}

    	});
  });

  app.route("/myPolls/:user").get(function(req, res) {
    console.log("User: " + req.params.user);
    Polls.find({
      "authorID": req.params.user
    }, function(err, data) {

      if (err) {
        console.log(err);
      } else {
        if(data) {
          res.json(data);
        } else {
          console.log("undefined");
        }
      }
    });
  });

  app.route("/newPoll").post(function(req, res) {
    if (typeof req.body === undefined) {
      console.log("undefined");
    } else {
      console.log(req.body.question);

    	var choices = req.body.options.split(",");
    	var list = choices.map(function(oneChoice) {
    		return {choice: oneChoice.trim(), vote: 0};
    	});

    	var poll = new Polls({
    		question: req.body.question,
    		options: list,
        totalVotes: 0,
        authorID: req.body.author
    	});

    	poll.save(function(err) {
    		if (err) {
    			console.log(err);
    		}
    	});

    }
  });

  app.route("/polls/:item").get(function(req, res) {
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
      Polls.findOneAndUpdate(
        { "question": req.params.item + "?",
          "options.choice" : req.body.choice },
        { $inc : {totalVotes : 1, "options.$.vote" : 1 } },
        function(err, data) {
          if (err) {
            console.log(err);
          }

          if (!data) {
            var obj = {
              choice: req.body.choice,
              vote: 1
            };
            Polls.findOneAndUpdate(
              {"question": req.params.item + "?"},
              {$push : { "options": obj } },
              {upsert: true, new: true},
              function(err) {
                if (err) console.log(err);
              }
            );
          }
        }
      );
    }
  });

  app.route("/polls/:item").delete(function(req, res) {
    if (typeof req.body === undefined) {
      console.log("Req.Body is undefined");
    } else {

      Polls.remove({"question" : req.params.item + "?"}, function(err) {
        console.log(err);
      });
      res.redirect("/polls");
    }
  });

  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname + '/client/public/index.html'));
  // });
};

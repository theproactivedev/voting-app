import React, { Component } from 'react';

class PollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      choices: [],
      vote: ""
    };

    this.getPoll = this.getPoll.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.handleVoteChange = this.handleVoteChange.bind(this);
  }

  handleVoteChange(e) {
    this.setState({
      vote: e.target.value
    });
    console.log("submitVote: " + e.target.value);
  }

  submitVote() {
    console.log("State Vote: " + this.state.vote);
    console.log("Entering submitVote method");

    var url = "/polls/" + this.props.match.params.item + "/vote";
    var vote = {
      choice : this.state.vote
    };

    fetch(url,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: "POST",
			body: JSON.stringify(vote)
		})
		.then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject({
          status: res.status,
          statusTxt: res.statusText,
          link: res.url
        });
      }
    })
    .then(data => {
			alert(JSON.stringify(data));
		})
		.catch(function(err) {
      console.log("Status: " + err.status + " " + err.statusTxt);
      console.log("Link: " + err.link);
    });

    console.log("Done submitVote!");
  }

  getPoll() {
    var params = this.props.match.params.item;
    var url = "/polls/" + params;
    var that = this;

    fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject({
          status: res.status,
          statusTxt: res.statusText,
          link: res.url
        });
      }
    })
    .then(function(item) {
      that.setState({
        query: item.question,
        choices: item.options
      });
    })
    .catch(function(err) {
      console.log("Status: " + err.status + " " + err.statusTxt);
      console.log("Link: " + err.link);
    });

  }

  componentWillMount() {
    this.getPoll();
  }

  render() {
    var options = [];
    options = this.state.choices.map(function(choice, index) {
      return (
        <option key={index} value={choice.choice}>{choice.choice}</option>
      );
    });

    return(
      <div className="container">
        <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-6">
        <form onSubmit={this.submitVote}>
          <div className="form-group">
            <label className="question">{this.state.query}</label>
            <p>I would like to vote for: </p>
            <select className="form-control" onChange={this.handleVoteChange}>
              {options}
            </select>
          </div>
          <div className="form-group">
            <input type="submit" value="Submit" className="btn btn-primary" />
          </div>
        </form>
        </div>
        </div>
      </div>
    );
  }
}

export default PollItem;

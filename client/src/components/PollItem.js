import React, { Component } from 'react';
import PollChart from './PollChart.js';
import { Redirect } from 'react-router-dom';

class PollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      choices: [],
      vote: "Select your answer.",
      hasVoted: true,
      author: "",
      pollAuthor: "",
      redirect: false
    };

    this.handleResponse = this.handleResponse.bind(this);
    this.handleError = this.handleError.bind(this);
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
    this.getPoll = this.getPoll.bind(this);
    this.tweetPoll = this.tweetPoll.bind(this);
    this.deletePoll = this.deletePoll.bind(this);

    this.submitVote = this.submitVote.bind(this);
    this.handleVoteChange = this.handleVoteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.isUserLoggedIn();
  }

  componentDidMount() {
    this.getPoll();
  }

  isUserLoggedIn() {
    if (localStorage['abcd'] !== undefined) {
      var user = JSON.parse(localStorage['abcd']);
      this.setState({
        author: user.identity
      });
    }
  }

  handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject({
        status: res.status,
        statusTxt: res.statusText,
        link: res.url
      });
    }
  }

  handleError(err) {
    console.log("Status on Poll Item: " + err.status + " " + err.statusTxt);
    console.log("Link on Poll Item: " + err.link);
  }

  handleVoteChange(e) {
    this.setState({
      vote: e.target.value
    });
  }

  handleSubmit(e) {
    console.log(this.state.vote + " - State");
    e.preventDefault();
    if (this.state.vote === "Select your answer.") {
      this.setState({ hasVoted : false });
    } else {
      this.submitVote();
      this.setState({ hasVoted : true });
      setTimeout(this.getPoll, 600);
    }
  }

  submitVote() {
    console.log(this.props.match.params.item);
    var url = this.props.data + "/" + this.props.match.params.item;
    var vote = {
      choice : this.state.vote
    };

    if (this.state.vote === "Others") {
      vote = {
        choice : document.getElementById("otherAnswer").value
      };
      this.setState({
        vote: 'Select your answer.'
      });
    }

    fetch(url,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: "POST",
			body: JSON.stringify(vote)
		})
		.then(this.handleResponse)
		.catch(this.handleError);
  }

  getPoll() {
    var params = this.props.match.params.item;
    var url = this.props.data + "/" + params;
    var that = this;

    fetch(url)
    .then(this.handleResponse)
    .then(function(item) {
      that.setState({
        query: item.question,
        choices: item.options,
        pollAuthor: item.twitterID
      });
    })
    .catch(this.handleError);

  }

  tweetPoll() {
    window.open('https://twitter.com/intent/tweet?hashtags= freecodecamp&text='   + encodeURIComponent(this.state.query));
  }

  deletePoll() {
    var params = this.props.match.params.item;
    var url = this.props.data + "/" + params;

    fetch(url, {method: "DELETE"})
    .then(this.handleResponse)
    .catch(this.handleError);
    this.setState({redirect: true});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={{pathname: "/polls"}} />
    }

    var options = [];
    options = this.state.choices.map(function(choice, index) {
      return (
        <option key={index+1} value={choice.choice}>{choice.choice}</option>
      );
    });

    if (this.state.author !== "") {
      const editable = (
        <option key={options.length+1} value="Others">Others</option>
      );
      options.push(editable);
    }

    return(
      <div className="container">
        {!this.state.hasVoted &&
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6">
              <div className="alert alert-danger">
              <p>Please select your answer.</p>
              </div>
            </div>
          </div>
        }

        <div className="row poll">
          <div className="col-sm-12 col-md-6 col-lg-6">
            <form>
              <div className="form-group">
                <label className="question">{this.state.query}
                {this.state.author === this.state.pollAuthor &&
                  <span className="pull-right" onClick={this.deletePoll}><i className="fa fa-trash" aria-hidden="true"></i></span>
                }
                </label>
                <p>I would like to vote for: </p>
                <select className="form-control" onChange={this.handleVoteChange}>
                  <option key={0} value="Select your answer.">Select your answer.</option>
                  {options}
                </select>
              </div>
              {this.state.vote === "Others" &&
                <div className="form-group">
                  <label htmlFor="otherAnswer">Others: </label>
                  <input type="text" id="otherAnswer" name="others" />
                </div>
              }
              <div className="form-group">
                <input type="submit" value="Submit" className="btn btn-primary" onClick={this.handleSubmit} />
                {this.state.author !== "" &&
                    <button type="button" className="btn btn-info pull-right" onClick={this.tweetPoll}>Tweet</button>
                }
              </div>
            </form>
          </div>

          <PollChart question={this.state.query} options={this.state.choices} />

        </div>
      </div>
    );
  }
}

export default PollItem;

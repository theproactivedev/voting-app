import React, { Component } from 'react';
import PollChart from '../components/PollChart.js';
import { Redirect } from 'react-router-dom';
import {
  getSpecificPoll,
  deletePoll,
  voteOnPoll
} from '../actions.js';
import DangerError from '../components/DangerError.js';
import { connect } from 'react-redux';

class PollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      choices: [],
      pollAuthor: "",
      vote: "Select your answer.",
      hasVoted: true,
      componentLink: ""
    };

    this.tweetPoll = this.tweetPoll.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
    this.getSpecificPoll = this.getSpecificPoll.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.handleVoteChange = this.handleVoteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getSpecificPoll() {
    const { dispatch } = this.props;
    dispatch(getSpecificPoll(this.state.componentLink));
  }

  componentWillMount() {
    const { ownProps, match } = this.props;
    this.setState({
      componentLink: ownProps.data + "/" + match.params.item
    }, this.getSpecificPoll);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPoll !== undefined ) {
      this.setState({
        query : nextProps.currentPoll.question,
        choices : nextProps.currentPoll.options,
        pollAuthor : nextProps.currentPoll.pollAuthor
      });
    }
  }

  handleVoteChange(e) {
    this.setState({
      vote: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.vote === "Select your answer.") {
      this.setState({ hasVoted : false });
    } else {
      this.submitVote();
      this.setState({ hasVoted : true });
      setTimeout(this.getSpecificPoll, 600);
    }
  }

  submitVote() {
    let vote = this.state.vote;

    if (this.state.vote === "Others") {
      vote =  document.getElementById("otherAnswer").value;
      this.setState({
        vote: 'Select your answer.'
      });
    }
    this.props.dispatch(voteOnPoll(this.state.componentLink, {choice: vote }));
  }

  tweetPoll() {
    window.open('https://twitter.com/intent/tweet?hashtags= freecodecamp&text='   + encodeURIComponent(this.state.query));
  }

  deletePoll() {
    this.props.dispatch(deletePoll(this.state.componentLink));
    this.setState({redirect: true});
  }

  render() {

    const { user } = this.props;
    let options = [];

    if (this.state.redirect) {
      return <Redirect to={{pathname: "/polls"}} />
    }

    options = this.state.choices.map(function(choice, index) {
      return (
        <option key={index+1} value={choice.choice}>{choice.choice}</option>
      );
    });

    if (user.userName !== "") {
      const editable = (
        <option key={options.length+1} value="Others">Others</option>
      );
      options.push(editable);
    }

    return(
      <div className="container">
        {!this.state.hasVoted &&
          <DangerError />
        }

        <div className="row poll">
          <div className="col-sm-12 col-md-6 col-lg-6">
            <form>
              <div className="form-group">
                <label className="question">{this.state.query}
                {user.userId === this.state.pollAuthor &&
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
                {user.userName !== "" &&
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

function mapStateToProps(state, ownProps) {
  const { isUserAuthenticated, user, currentPoll } = state;
  return {
    isUserAuthenticated,
    user,
    ownProps,
    currentPoll
  };
}

export default connect(mapStateToProps)(PollItem);

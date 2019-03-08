import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSpecificPoll, deletePoll, voteOnPoll } from '../actions.js';
import DangerError from '../components/DangerError.js';
import PollChart from '../components/PollChart.js';

class PollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      choices: [],
      author: "",
      vote: "Select your answer.",
      hasVoted: true,
      componentLink: ""
    };

    this.tweetPoll = this.tweetPoll.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.handleVoteChange = this.handleVoteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { ownProps, match } = this.props;
    let pollItem = ownProps.data + "/" + match.params.item;
    this.setState({ componentLink:  pollItem });
    this.props.dispatch(getSpecificPoll(pollItem));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPoll !== undefined ) {
      this.setState({
        query : nextProps.currentPoll.question,
        choices : nextProps.currentPoll.options,
        author : nextProps.currentPoll.author
      });
    }
  }

  handleVoteChange(e) {
    this.setState({
      vote: e.target.value
    });
  }

  handleSubmit(e) {
    let that = this;
    e.preventDefault();
    if (this.state.vote === "Select your answer.") {
      this.setState({ hasVoted : false });
    } else {
      this.submitVote();
      this.setState({ hasVoted : true });
      setTimeout(function() {
        that.props.dispatch(getSpecificPoll(that.state.componentLink));
      }, 600);
    }
  }

  submitVote() {
    let vote = this.state.vote;

    if (vote === "Others") {
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
    this.setState({ redirect: true });
  }

  render() {

    const { user : { twitter, local } } = this.props;
    let options = [];

    if (this.state.redirect) {
      return <Redirect to={{pathname: "/polls"}} />
    }

    options = this.state.choices.map(function(choice, index) {
      return (
        <option key={index+1} value={choice.choice}>{choice.choice}</option>
      );
    });

    if (twitter.username !== "" || local.username !== "") {
      const editable = (
        <option key={options.length+1} value="Others">Others</option>
      );
      options.push(editable);
    }

    return(
      <div className="gradient">
      <div className="container">
        {!this.state.hasVoted &&
          <DangerError msg={"Please select your answer."} />
        }

        <div className="row poll">
          <div className="col-sm-12 col-md-4 col-lg-4">
            <form action="" method="POST" onSubmit={(e) => this.handleSubmit(e)}>
              <div className="form-group">
                <label className="question">{this.state.query}
                {(local.username === this.state.author || twitter.username === this.state.author) &&
                  <span className="pull-right" onClick={this.deletePoll}><i className="fa fa-trash" aria-hidden="true"></i></span>
                }
                </label>
                <p>I would like to vote for: </p>
                <select className="form-control" onChange={(e) => this.handleVoteChange(e)}>
                  <option key={0} value="Select your answer.">Select your answer.</option>
                  {options}
                </select>
              </div>
              {this.state.vote === "Others" &&
                <div className="form-group">
                  <label htmlFor="otherAnswer">Others: </label>
                  <input type="text" className="form-control" id="otherAnswer" name="others" placeholder="Customized Option" />
                </div>
              }
              <div className="form-group">
                <input type="submit" value="Submit" className="btn btn-primary" />
                {twitter.username.length > 0 &&
                <button type="button" className="btn btn-info pull-right" onClick={this.tweetPoll}>Tweet</button>
                }
              </div>
            </form>
          </div>
          <PollChart question={this.state.query} options={this.state.choices} />
        </div>
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

PollItem.propTypes = {
	isUserAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  ownProps: PropTypes.object.isRequired,  
  currentPoll: PropTypes.object.isRequired,  
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(PollItem);

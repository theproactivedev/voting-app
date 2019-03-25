import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSpecificPoll, voteOnPoll } from '../actions.js';
import DangerError from '../components/DangerError.js';
import Fade from 'react-reveal/Fade';

class VotingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vote: "Select your answer.",
      hasVoted: true
    };

    this.submitVote = this.submitVote.bind(this);
    this.handleVoteChange = this.handleVoteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      this.props.getSpecificPoll(this.props.componentLink);
    }
  }

  async submitVote() {
    let vote = this.state.vote;

    if (vote === "Others") {
      vote =  document.getElementById("otherAnswer").value;
      this.setState({
        vote: 'Select your answer.'
      });
    }
    this.props.voteOnPoll(this.props.componentLink, {choice: vote });
  }

  render() {
    const { user : { twitter, local }, 
    author, query, options, 
    deletePoll, tweetPoll } = this.props;

    return (
      <div className="col-sm-12 col-md-4 col-lg-4">
        {!this.state.hasVoted &&
          <DangerError msg={"Please select your answer."} />
        }
        <Fade left>
        <form action="" method="POST" onSubmit={(e) => this.handleSubmit(e)}>
          <div className="form-group">
            <label className="question" htmlFor="options">{query}
            {(local.username === author || twitter.username === author) &&
              <span className="pull-right" onClick={deletePoll} data-testid="deletePoll"><i className="fa fa-trash" aria-hidden="true"></i></span>
            }
            </label>
            <p>I would like to vote for: </p>
            <select id="options" data-testid="optionsSelect" className="form-control" onChange={(e) => this.handleVoteChange(e)}>
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
            <button type="button" className="btn btn-info pull-right" onClick={tweetPoll}>Tweet</button>
            }
          </div>
        </form>
        </Fade>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSpecificPoll: (path) => dispatch(getSpecificPoll(path)),
    voteOnPoll: (path, obj) => dispatch(voteOnPoll(path, obj))
  };
}


export default connect(null, mapDispatchToProps)(VotingForm);
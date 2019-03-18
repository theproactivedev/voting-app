import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSpecificPoll, deletePoll } from '../actions.js';
import PollChart from '../components/polls/PollChart';
import VotingForm from './VotingForm';

class PollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      choices: [],
      author: "",
      componentLink: ""
    };

    this.tweetPoll = this.tweetPoll.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
    this.renderPollOptions = this.renderPollOptions.bind(this);
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

  tweetPoll() {
    window.open('https://twitter.com/intent/tweet?hashtags= freecodecamp&text='   + encodeURIComponent(this.state.query));
  }

  deletePoll() {
    this.props.dispatch(deletePoll(this.state.componentLink));
    this.setState({ redirect: true });
  }

  renderPollOptions() {
    return this.state.choices.map(function(choice, index) {
      return (
        <option key={index+1} value={choice.choice}>{choice.choice}</option>
      );
    });
  }

  render() {
    const { user : { twitter, local } } = this.props;
  
    let options = this.renderPollOptions();
    if (twitter.username !== "" || local.username !== "") {
      options.push(<option key={options.length+1} value="Others">Others</option>);
    }

    if (this.state.redirect) {
      return <Redirect to={{pathname: "/polls"}} />
    }

    return(
      <div className="gradient">
        <div className="container">
          <div className="row poll">
            <VotingForm user={this.props.user} author={this.state.author} query={this.state.query}
              options={options} deletePoll={this.deletePoll} 
              tweetPoll={this.tweetPoll}
              componentLink={this.state.componentLink}
            />
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
	isUserAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  ownProps: PropTypes.object,  
  currentPoll: PropTypes.object,  
  dispatch: PropTypes.func
};

export default connect(mapStateToProps)(PollItem);

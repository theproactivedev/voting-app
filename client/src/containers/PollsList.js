import React, { Component } from 'react';
import { Redirect} from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPolls, getPublicPolls } from '../actions.js';
import ClipLoader from 'react-spinners/ClipLoader';
import PageTitle from '../components/PageTitle';
import PollListItem from '../components/polls/PollListItem';

class PollsList extends Component {
  constructor(props) {
    super(props);

    this.renderPollItems = this.renderPollItems.bind(this);
  }

  componentDidMount() {
    const { data, dispatch, user : { twitter, local } } = this.props;
    if (data === "/polls") {
      dispatch(getPublicPolls());
    } else if (data === "/myPolls") {
      dispatch(getPolls(local.username || twitter.username));
    }
  }

  renderPollItems() {
    const { polls } = this.props;
    if (polls !== undefined) {
			return polls.map(function(poll, index) {
        return <PollListItem key={index} poll={poll} />
			});
    }

    return [];
  }

  render() {
    const { data, polls, isUserAuthenticated, isFetching } = this.props;
    let headline = data === "/polls" ? "Polls" : "My Polls";
    let pollItems = this.renderPollItems();

    if (!isUserAuthenticated && data === "/myPolls") {
      return <Redirect to={{pathname: '/'}} />
    }

    return(
      <div>
        <PageTitle title={headline} />
        <div className="container">
          <div className="text-center justify-content-center">
            <ClipLoader sizeUnit={"px"} size={60} color={"#008793"} loading={isFetching} />
          </div>
          {!isUserAuthenticated && !isFetching &&
            <div className="mb-3">
              <p>Vote your answer and share it on Twitter. And you can also create your own answer if you&#39;re signed in. So make sure to sign in!</p>
            </div>
          }
          {polls.length === 0 && !isFetching &&
            <p>No questions. Sign in and create your own poll.</p>
          }
          {!isFetching && polls.length > 0 &&
            <ListGroup as="ul" className="poll-items">{pollItems}</ListGroup>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { isUserAuthenticated, polls, isFetching, user } = state;
  return {
    isUserAuthenticated,
    polls,
    ownProps, isFetching, user
  };
}

PollsList.propTypes = {
	isUserAuthenticated: PropTypes.bool,
  polls: PropTypes.array,
  ownProps: PropTypes.object,  
  dispatch: PropTypes.func 
};

export default connect(mapStateToProps)(PollsList);

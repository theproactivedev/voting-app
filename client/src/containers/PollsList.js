import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  getPolls
} from '../actions.js';
import { connect } from 'react-redux';

class PollsList extends Component {
  componentDidMount() {
    const { ownProps, user } = this.props;
    this.props.dispatch(getPolls(ownProps.data, user.userToken));
  }

  render() {
    let headline = this.props.data === "/polls" ? "Polls" : "My Polls";
    let polls = [];
		if (this.props.polls !== undefined) {
			polls = this.props.polls.map(function(poll, index) {
				return (
					<li key={index}>
            <div className="panel panel-info">
              <div className="panel-body">
                <Link to={`/polls/${poll.question}`}>{poll.question}</Link>
              </div>
            </div>
          </li>
				);
			});
		}

    return(
      <div className="container">
				<div className="row">
          <h2>{headline}</h2>
          <div>
            {polls.length === 0 &&
              <p>No questions. Sign in and create your own poll.</p>
            }
          </div>
          <div>
            {
  						polls.length > 0 &&
  						<ul>{polls}</ul>
  					}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { isUserAuthenticated, user, polls } = state;
  return {
    isUserAuthenticated,
    user,
    polls,
    ownProps
  };
}

export default connect(mapStateToProps)(PollsList);

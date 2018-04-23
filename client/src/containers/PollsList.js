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
              <div className="panel-body text-center">
                <Link to={`/polls/${poll.question}`}>{poll.question}</Link>
              </div>
            </div>
          </li>
				);
			});
		}

    return(
      <div>
        <div className="header mb-5">
          <div className="container">
            <h2>{headline}</h2>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-lg-offset-2 col-lg-8">
            <div className="mb-5">
            <p>Select the question to see more details about it.</p>
            <p>You can vote and you can share it on Twitter. And you can also create your own answer if you&#39;re signed in.</p>
            </div>
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

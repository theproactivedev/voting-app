import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import {
  getPolls, getPublicPolls
} from '../actions.js';
import { connect } from 'react-redux';

class PollsList extends Component {
  componentDidMount() {
    const { ownProps, user } = this.props;
    if (this.props.data === "/polls") {
      this.props.dispatch(getPublicPolls());
    } else if (this.props.data === "/myPolls") {
      this.props.dispatch(getPolls(ownProps.data, user.userToken));
    }
  }

  render() {
    let headline = this.props.data === "/polls" ? "Polls" : "My Polls";
    let polls = [];
		if (this.props.polls !== undefined) {
			polls = this.props.polls.map(function(poll, index) {
        let postDate = new Date(poll.postDate);
		    let postDateStr = `${postDate.getUTCFullYear()}/${postDate.getMonth() + 1}/${postDate.getDate()}`;
				return (
          
					<ListGroup.Item action variant="light" key={index}>
            {poll.postDate.length > 0 &&
            <div className="postDate pb-1">{postDateStr}</div>
            }
            <Link to={`/polls/${poll.question}`} className="d-block w-100">{poll.question}
            <span title="Total Votes" className="votes float-right">{poll.totalVotes}</span>            
            </Link>
          </ListGroup.Item>
				);
			});
		}

    return(
      <div>
        <div className="header mb-5">
          <div className="container">
            <h1 className="text-white text-center py-4">{headline}</h1>
          </div>
        </div>
        <div className="container">
          <div className="mb-3">
            <p>Vote your answer and share it on Twitter. And you can also create your own answer if you&#39;re signed in. So make sure to sign in!</p>
          </div>
          <div>
            {polls.length === 0 &&
              <p>No questions. Sign in and create your own poll.</p>
            }
          </div>
          <div>
            {
              polls.length > 0 &&
              <ListGroup>{polls}</ListGroup>
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

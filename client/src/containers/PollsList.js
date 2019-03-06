import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPolls, getPublicPolls } from '../actions.js';
import ClipLoader from 'react-spinners/ClipLoader';

class PollsList extends Component {
  componentDidMount() {
    const { ownProps } = this.props;
    if (this.props.data === "/polls") {
      this.props.dispatch(getPublicPolls());
    } else if (this.props.data === "/myPolls") {
      this.props.dispatch(getPolls(ownProps.data));
    }
  }

  render() {
    const { data, polls, isUserAuthenticated } = this.props;

    if (!isUserAuthenticated && data === "/myPolls") {
      return <Redirect to={{pathname: '/'}} />
    }
    
    let headline = data === "/polls" ? "Polls" : "My Polls";
    let pollsList = [];
		if (polls !== undefined) {
			pollsList = polls.map(function(poll, index) {
        let postDate = new Date(poll.postDate);
        let postDateStr = `${postDate.getUTCFullYear()}/${postDate.getMonth() + 1}/${postDate.getDate()}`;

				return (
					<ListGroup.Item action variant="light" key={index} as="li" className="pollQuestion">
            <Link to={`/polls/${poll.question}`} className="d-block w-100">
            {poll.postDate.length > 0 &&
            <p className="postDate pb-1 mb-0">{postDateStr}</p>
            }
            <p className="mb-0 d-inline-block">{poll.question}</p>
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
          <div className="text-center justify-content-center">
            <ClipLoader sizeUnit={"px"} size={60} color={"#00d8ff"} loading={this.props.isFetching} />
          </div>
          {!this.props.isUserAuthenticated && !this.props.isFetching &&
            <div className="mb-3">
              <p>Vote your answer and share it on Twitter. And you can also create your own answer if you&#39;re signed in. So make sure to sign in!</p>
            </div>
          }
          {polls.length === 0 && !this.props.isFetching &&
            <p>No questions. Sign in and create your own poll.</p>
          }
          {!this.props.isFetching && polls.length > 0 &&
            <ListGroup as="ul">{pollsList}</ListGroup>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { isUserAuthenticated, polls, isFetching } = state;
  return {
    isUserAuthenticated,
    polls,
    ownProps, isFetching
  };
}

PollsList.propTypes = {
	isUserAuthenticated: PropTypes.bool.isRequired,
  polls: PropTypes.array.isRequired,
  ownProps: PropTypes.object.isRequired,  
  dispatch: PropTypes.func.isRequired 
};

export default connect(mapStateToProps)(PollsList);

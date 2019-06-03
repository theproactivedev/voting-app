import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";

class PollListItem extends Component {
  render() {
    const { poll } = this.props;
    let postDate = new Date(poll.postDate);
    let postDateStr = `${postDate.getUTCFullYear()}/${postDate.getMonth() + 1}/${postDate.getDate()}`;
  
    return (
      <ListGroup.Item action variant="light" as="li" className="pollQuestion">
        <Link to={`/polls/${poll.question}`} className="d-block w-100">
        {poll.postDate.length > 0 &&
        <p className="postDate pb-1 mb-0">{postDateStr}</p>
        }
        <p className="mb-0 d-inline-block">{poll.question}</p>
        <span title="Total Votes" className="votes float-right">{poll.totalVotes}</span>            
        </Link>
      </ListGroup.Item>
    );
  }
}

export default PollListItem;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class PollsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: []
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
		var that = this;
    // console.log(typeof this.props.data + " " + this.props.data);
    // var url = this.props.data + "";
    fetch("/polls")
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject({
          status: res.status,
          statusTxt: res.statusText,
          link: res.url
        });
      }
    })
    .then(function(items) {
			if (items === undefined) {
				items = [];
 			}

      that.setState({
        polls: items
      });
    })
    .catch(function(err) {
      console.log("Status: " + err.status + " " + err.statusTxt);
      console.log("Link: " + err.link);
    });
  }

  render() {
		var polls = this.state.polls;
		var listItems = [];

		if (polls.length > 0) {
			listItems = this.state.polls.map(function(poll, index) {
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
        <h1>Voting Polls</h1>
        <div>
          {this.state.polls.length === 0 &&
            <p>No questions. Sign in and create your own poll.</p>
          }
        </div>
        <div>
          {
						listItems.length > 0 &&
						<ul>{listItems}</ul>
					}
        </div>
        </div>
      </div>
    );
  }
}

export default PollsList;

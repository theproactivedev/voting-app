import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PollsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: [],
      author: ""
    };
    this.fetchData = this.fetchData.bind(this);
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillMount() {
    this.isUserLoggedIn();
  }

  isUserLoggedIn() {
    if (localStorage['abcd'] !== undefined) {
      var user = JSON.parse(localStorage['abcd']);
      this.setState({
        author: user.identity
      });
    }
  }

  fetchData() {
		var that = this;
    var url = this.props.data === "/myPolls" ? this.props.data
    + "/" + this.state.author : this.props.data;
    console.log("Polls List: " + this.state.author);
    fetch(url)
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
      console.log("Status on Polls List: " + err.status + " " + err.statusTxt);
      console.log("Link on Polls List: " + err.link);
    });
  }

  render() {
		var polls = this.state.polls;
		var listItems = [];
		if (polls.length > 0) {
      // var pollLink = this.props.data + "/";
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

    var headline = this.props.data === "/polls" ? "Polls" :
    "My Polls";

    return(
      <div className="container">
				<div className="row">
        <h1>{headline}</h1>
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

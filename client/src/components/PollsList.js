import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PollsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: [],
      author: "",
      token: ""
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
        author: user.identity,
        token: user.token
      });
    }
  }

  fetchData() {
		var that = this;
    
    fetch(this.props.data, {
      method: "GET",
      headers: new Headers({
        'Content-type' : 'application/json',
        'x-auth-token' : this.state.token
      })
    })
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
        <h2>{headline}</h2>
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

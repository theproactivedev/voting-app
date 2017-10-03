import React, {Component} from 'react';

class Home extends Component {
	render() {
		return(
			<div className="container">
      <h1>Build a Voting App</h1>
      <p>Go to the Polls page and start voting!</p>
			<a href="/auth/twitter" className="btn btn-info">Log in with Twitter</a>
      </div>
		);
	}
}

export default Home;

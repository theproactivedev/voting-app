import React, {Component} from 'react';

class Home extends Component {
	render() {
		return(
			<div className="container">
      <h1>Build a Voting App</h1>
			{this.props.isUserAuthenticated &&
				<p>Hello, {this.props.authorName}</p>
			}
      <p>Go to the Polls page and start voting!</p>
      </div>
		);
	}
}

export default Home;

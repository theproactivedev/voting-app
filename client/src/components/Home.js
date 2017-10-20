import React, {Component} from 'react';

class Home extends Component {
	render() {
		return(
			<div className="container" id="home">
      <h1>Build a Voting App</h1>
			{this.props.isUserAuthenticated &&
				<p>Hello, {this.props.authorName}</p>
			}
      <p>Go to the <strong>Polls</strong> page and start voting!</p>
      </div>
		);
	}
}

export default Home;

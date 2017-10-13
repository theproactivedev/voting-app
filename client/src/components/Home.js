import React, {Component} from 'react';

class Home extends Component {

	constructor() {
		super();
		this.state = {
			isAuthenticated: false,
			user: null
		};

		this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
	}

	isUserLoggedIn() {
		if (localStorage['abcd'] !== undefined) {
			this.setState({
				isAuthenticated: true,
				user: JSON.parse(localStorage['abcd'])
			});
		}
	}

	componentDidMount() {
		this.isUserLoggedIn();
	}

	render() {
		return(
			<div className="container">
      <h1>Build a Voting App</h1>
			{this.state.isAuthenticated &&
				<p>Hello, {this.state.user.name}</p>
			}
      <p>Go to the Polls page and start voting!</p>
      </div>
		);
	}
}

export default Home;

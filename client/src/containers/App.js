import React, {Component} from 'react';
import Navigation from '../components/Navigation';
import MainContent from '../components/MainContent';

class App extends Component {
	constructor() {
		super();
		this.state = {
			isAuthenticated: false,
			author: "",
			authorId: "",
			token: ""
		};

		this.onLogin = this.onLogin.bind(this);
		this.onLogout = this.onLogout.bind(this);
	}

	componentWillMount() {
		if (localStorage['abcd'] !== undefined) {
			var user = JSON.parse(localStorage['abcd']);
			this.setState({
				author: user.name,
				isAuthenticated: true,
				token: user.token,
				authorId: user.identity
			});
		}
	}

	onLogin(isUserAuthenticated, authorName, authorID, authorToken) {
		this.setState({
			isAuthenticated: isUserAuthenticated,
			author: authorName,
			token: authorToken,
			authorId: authorID
		});
	}

	onLogout() {
		this.setState({
			isAuthenticated: false,
			author: "",
			authorId: "",
			token: ""
		});
	}

	render() {
		return(
			<div>
				<Navigation onUserLogin={this.onLogin} onUserLogout={this.onLogout} />
				<MainContent isUserAuthenticated={this.state.isAuthenticated}
				  authorName={this.state.author} authorToken={this.state.token}
					authorId={this.state.authorId} />
			</div>
		);
	}
}

export default App;

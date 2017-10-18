import React, {Component} from 'react';
import Navigation from '../components/Navigation';
import MainContent from '../components/MainContent';

class App extends Component {
	constructor() {
		super();
		this.state = {
			isAuthenticated: false,
			author: "",
			identification: ""
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
				identification: user.identity
			});
		}
	}

	onLogin(isUserAuthenticated, authorName, authorId) {
		this.setState({
			isAuthenticated: isUserAuthenticated,
			author: authorName,
			identification: authorId
		});
	}

	onLogout() {
		this.setState({
			isAuthenticated: false,
			author: "",
			identification: ""
		});
	}

	render() {
		return(
			<div>
				<Navigation onUserLogin={this.onLogin} onUserLogout={this.onLogout} />
				<MainContent isUserAuthenticated={this.state.isAuthenticated}
				  authorName={this.state.author} authorId={this.state.identification} />
			</div>
		);
	}
}

export default App;

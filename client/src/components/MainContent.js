import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import {Route} from 'react-router-dom';
import Polls from './Polls';
import PollForm from './PollForm';
import Home from './Home';

class MainContent extends Component {
	render() {
		return(
			<Switch>
				<Route exact path="/" render={(props) => (
				  <Home {...props} isUserAuthenticated={this.props.isUserAuthenticated}
					  authorName={this.props.authorName} />
				)} />
				<Route path="/polls" component={Polls} />
				<Route path="/myPolls/:user" component={Polls} />
				<Route path="/newPoll" render={(props) => (
				  <PollForm {...props} authorId={this.props.authorId} />
				)} />
			</Switch>
		);
	}
}

export default MainContent;

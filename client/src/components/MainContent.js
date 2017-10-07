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
				<Route exact path="/" component={Home} />
				<Route path="/polls" component={Polls} />
				<Route path="/newPoll" component={PollForm} />
			</Switch>
		);
	}
}

export default MainContent;

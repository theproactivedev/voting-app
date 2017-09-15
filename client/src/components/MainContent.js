import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import {Route} from 'react-router-dom';
import Polls from './Polls';
import PollForm from './PollForm';

class MainContent extends Component {
	render() {
		return(
			<Switch>
				<Route exact path="/" component={Polls} />
				<Route path="/public/newPoll" component={PollForm} />
			</Switch>
		);
	}
}

export default MainContent;

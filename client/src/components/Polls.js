import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import {Route} from 'react-router-dom';
import PollsList from './PollsList';
import PollItem from './PollItem';

class Polls extends Component {
	render() {

		return(
			<Switch>
			<Route exact path="/polls" component={PollsList} />
			<Route path="/polls/:item" component={PollItem} />
			</Switch>
		);
	}
}

export default Polls;

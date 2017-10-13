import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import {Route} from 'react-router-dom';
import PollsList from './PollsList';
import PollItem from './PollItem';

class Polls extends Component {
	render() {

		return(
			<Switch>
				<Route exact path="/polls" render={(props) => (
				  <PollsList {...props} data={'/polls'} />
				)} />
				<Route path="/polls/:item" render={(props) => (
				  <PollItem {...props} data={'/polls'} />
				)} />

				<Route path="/myPolls/:user" render={(props) => (
				  <PollsList {...props} data={'/myPolls'} />
				)} />
				<Route path="/myPolls/:item" render={(props) => (
				  <PollItem {...props} data={'/myPolls'} />
				)} />
			</Switch>
		);
	}
}

export default Polls;

import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import PollsList from '../containers/PollsList';
import PollItem from '../containers/PollItem';

const Polls = () => {
	return(
		<Switch>
			<Route exact path="/polls" key={'/polls'} render={(props) => (
			  <PollsList {...props} data={'/polls'} />
			)} />
			<Route path="/polls/:item" render={(props) => (
			  <PollItem {...props} data={'/polls'} />
			)} />
			<Route exact path="/myPolls" key={"/myPolls"} render={(props) => (
			  <PollsList {...props} data={'/myPolls'} />
			)} />
		</Switch>
	);
};

export default Polls;

import React, {Component} from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Polls from '../components/Polls';
import PollForm from './PollForm';
import Home from '../components/Home';
import { connect } from 'react-redux';

class MainContent extends Component {
	render() {
		return(
			<Switch>
				<Route exact path="/" render={(props) => (
				  <Home {...props} isUserAuthenticated={this.props.isUserAuthenticated}
					  userName={this.props.user.userName} />
				)} />
				<Route path="/polls" component={Polls} />
				<Route path="/myPolls" component={Polls} />
				<Route path="/newPoll" render={(props) => (
				  <PollForm {...props} userToken={this.props.user.userToken}
					userId={this.props.user.userId} />
				)} />
			</Switch>
		);
	}
}

function mapStateToProps(state) {
  const { isUserAuthenticated, user } = state;
  return {
    isUserAuthenticated,
    user
  };
}

export default withRouter(connect(mapStateToProps)(MainContent));
// export default MainContent;

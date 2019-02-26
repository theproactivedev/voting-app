import React, {Component} from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Polls from '../components/Polls';
import PollForm from './PollForm';
import Home from '../components/Home';
// import UserFormContainer from '../components/UserFormContainer';
import Profile from './Profile';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class MainContent extends Component {
	render() {

		// <Route path="/signup" component={UserFormContainer} />
		// <Route path="/login" component={UserFormContainer} />
		const { isUserAuthenticated, user } = this.props;
		return(
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/polls" component={Polls} />
				<Route path="/myPolls" component={Polls} />
				<Route path="/newPoll" render={(props) => (
				  <PollForm {...props} isUserAuthenticated={isUserAuthenticated} user={user}  />
				)} />
				<Route path="/profile" component={Profile} />
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

MainContent.propTypes = {
	isUserAuthenticated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps)(MainContent));
// export default MainContent;

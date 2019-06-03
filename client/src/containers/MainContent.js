import React, {Component} from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Polls from "../components/polls/Polls";
import Home from "../components/Home";
import PollForm from "./PollForm";
import NotFound from "../components/NotFound";

class MainContent extends Component {
	render() {
		const { isUserAuthenticated, user } = this.props;
		return(
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/polls" component={Polls} />
				<Route path="/myPolls" component={Polls} />
				<Route path="/newPoll" render={(props) => (
				  <PollForm {...props} isUserAuthenticated={isUserAuthenticated} user={user}  />
				)} />
				<Route path="*" exact={true} component={NotFound} />
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
	isUserAuthenticated: PropTypes.bool,
	user: PropTypes.object
};

export default withRouter(connect(mapStateToProps)(MainContent));

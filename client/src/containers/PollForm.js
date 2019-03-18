import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addPoll } from '../actions.js';
import Form from '../components/polls/Form';
import PageTitle from '../components/PageTitle';

class PollForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			query: "",
			choices: "",
			redirect: false,
			hasCreatedPoll: true
		};

		this.handleQuestionChange = this.handleQuestionChange.bind(this);
		this.handleOptionsChange = this.handleOptionsChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.postData = this.postData.bind(this);
	}

	handleQuestionChange(e) {
		this.setState({ query: e.target.value });
	}

	handleOptionsChange(e) {
		this.setState({ choices: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		let question = this.state.query.trim();
		let options = this.state.choices.trim();
		if (!question || !options) {
			this.setState({ hasCreatedPoll: false })
		} else {
			this.postData(question, options);
			document.getElementById("newPollForm").reset();
		}
	}

	postData(query, choices) {
		const { user: { twitter, local } } = this.props;
		var obj = {
			question: query, options: choices,
			author: local.username.length > 0 ? local.username : twitter.username
		};

		this.props.dispatch(addPoll("/newPoll", obj));
		this.setState({
			query: "", choices: [], redirect: true, hasCreatedPoll: true
		});
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to={{pathname: '/myPolls'}} />
		}

		if (!this.props.isUserAuthenticated) {
      return <Redirect to={{pathname: '/'}} />
    }

		return(
			<div>
				<PageTitle title={'Create Poll'} />
				<Form handleSubmit={this.handleSubmit} handleOptionsChange={this.handleOptionsChange}
					handleQuestionChange={this.handleQuestionChange}
				 />
			</div>
		);
	}
}

function mapStateToProps(state) {
  const { user, isUserAuthenticated } = state;
  return {
    user, isUserAuthenticated
  };
}

PollForm.propTypes = {
	user: PropTypes.object,
	isUserAuthenticated: PropTypes.bool,
	dispatch: PropTypes.func
};

export default connect(mapStateToProps)(PollForm);

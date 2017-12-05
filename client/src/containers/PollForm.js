import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import Form from '../components/Form.js';
import { addPoll } from '../actions.js';
import { connect } from 'react-redux';


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
		var obj = {
			question: query, options: choices,
			twitterId: this.props.user.userId
		};

		this.props.dispatch(addPoll("/newPoll", this.props.user.userToken, obj));
		this.setState({
			query: "", choices: [], redirect: true, hasCreatedPoll: true
		});
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to={{pathname: '/polls'}} />
		}

		return(
			<div>
				<Form hasCreatedPoll={this.state.hasCreatedPoll}
					handleSubmit={this.handleSubmit} handleOptionsChange={this.handleOptionsChange}
					handleQuestionChange={this.handleQuestionChange}
				 />
			</div>
		);
	}
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  };
}

export default connect(mapStateToProps)(PollForm);

import React, { Component } from 'react';

class PollForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			question: "",
			options: "",
			author: "",
			identification: ""
		};

		this.handleQuestionChange = this.handleQuestionChange.bind(this);
		this.handleOptionsChange = this.handleOptionsChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.postData = this.postData.bind(this);
		this.handleResponse = this.handleResponse.bind(this);
		this.isSomeoneLoggedIn = this.isSomeoneLoggedIn.bind(this);
	}

	isSomeoneLoggedIn(response) {
		const token = response.headers.get('x-auth-token');
		response.json().then(user => {
			if (token) {
				this.setState({
					author: user.twitterProvider.name,
					identification: user.twitterProvider.identification
				});
			}
		});
	}

	handleQuestionChange(e) {
		this.setState({ question: e.target.value });
	}

	handleOptionsChange(e) {
		this.setState({ options: e.target.value });
	}

	handleResponse(res) {
		if (res.ok) {
			return res.json();
		} else {
			return Promise.reject({
				status: res.status,
				statusTxt: res.statusText,
				link: res.url
			});
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		let question = this.state.question.trim();
		let options = this.state.options.trim();
		if (!question || !options) {
			return;
		} else {
			this.postData(question, options);
		}
		console.log(this.state.question + ": " + this.state.options);
	}

	postData(query, choices) {
		console.log("processing");
		var content = {
			question: query, options: choices,
			author: this.state.identification
		};
		fetch("/newPoll/",
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: "POST",
			body: JSON.stringify(content)
		})
		.then(this.handleResponse)
		.catch(function(err) {
      console.log("Status: " + err.status + " " + err.statusTxt);
      console.log("Link: " + err.link);
    });
		console.log("done");
//		.then(function(res){ return res.json(); });
		this.setState({ question: "", options: "", author: "", identification: "" });

	}

	componentWillMount() {
		this.isSomeoneLoggedIn();
	}

	render() {
		return(
			<div>

				<div className="container">
					<h2>Create Poll</h2>

					<div className="row">
						<div className="col-sm-12 col-md-8 col-lg-6">
						<form method="post" onSubmit={this.handleSubmit}>
								<div className="form-group">
										<label htmlFor="question">Question: </label>
										<input type="text" id="question" name="question" className="form-control" onChange={this.handleQuestionChange} />
								</div>
								<div className="form-group">
										<label htmlFor="options">Options: </label>
										<p>Separate options by comma.</p>
										<input type="text" id="options" name="options" className="form-control" onChange={this.handleOptionsChange} />
								</div>
								<div className="form-group">
										<input type="submit" value="Create Poll" id="createPoll" className="btn btn-primary" />
								</div>
						</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default PollForm;

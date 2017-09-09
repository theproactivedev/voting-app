import React, { Component } from 'react';

class PollForm extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			question: "",
			options: ""
		};
		
		this.handleQuestionChange = this.handleQuestionChange.bind(this);
		this.handleOptionsChange = this.handleOptionsChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.postData = this.postData.bind(this);
	}
	
	handleQuestionChange(e) {
		this.setState({ question: e.target.value });
	}
	
	handleOptionsChange(e) {
		this.setState({ options: e.target.value });
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

		this.setState({ question: "", options: "" });
	}
	
	postData(query, choices) {
		console.log("processing");
		fetch("http://localhost:3000/public/newPoll/processing-poll",
		{
			headers: {
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify({question: query, options: choices})
		});
		console.log("done");
//		.then(function(res){ return res.json(); });
	}
	
	render() {
		return(
			<div>
			
				<div className="container">
					<h2>Create Poll</h2>

					<div className="row">
						<form method="post" className="col-sm-12 col-md-8 col-lg-6" onSubmit={this.handleSubmit}>
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
		);
	}
}

export default PollForm;
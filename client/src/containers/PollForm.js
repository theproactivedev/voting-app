import React, { Component } from 'react';
import Navigation from '../components/Navigation';

class PollForm extends Component {
	render() {
		return(
			<div>
				<header>
					<Navigation />
				</header>
			
				<div class="container">
					<h2>Create Poll</h2>

					<div class="row">
						<form action="/poll" method="post" class="col-sm-12 col-md-8 col-lg-6">
								<div class="form-group">
										<label for="question">Question: </label>
										<input type="text" id="question" name="question" class="form-control">
								</div>
								<div class="form-group">
										<label for="options">Options: </label>
										<p>Separate options by comma.</p>
										<input type="text" id="options" name="options" class="form-control">
								</div>
								<div class="form-group">
										<input type="submit" value="Create Poll" id="createPoll" class="btn btn-primary">
								</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default PollForm;
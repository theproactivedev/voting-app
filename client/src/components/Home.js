import React from 'react';
import '../assets/css/homestyle.css';
import Tools from './Tools';
import ProjectDescription from './ProjectDescription';
import PropTypes from 'prop-types';

const Home = ({ isUserAuthenticated, userName }) => {
	return(
		<div>
			<div id="home">
				<div className="overlay">
				<div className="container">
					<h1>Build a Voting App</h1>
					{isUserAuthenticated &&
						<p>Hello, {userName}</p>
					}
				</div>
				</div>
			</div>

			<ProjectDescription />
			<Tools />
		</div>
	);
}

Home.propTypes = {
	isUserAuthenticated: PropTypes.bool.isRequired,
	userName: PropTypes.string.isRequired
}

export default Home;

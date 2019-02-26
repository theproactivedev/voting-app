import React from 'react';
import '../assets/css/homestyle.css';
import Tools from './Tools';
import ProjectDescription from './ProjectDescription';

const Home = () => {
	return(
		<div>
			<div id="home">
				<div className="overlay">
				<div className="container">
					<h1>Build a Voting App</h1>
				</div>
				</div>
			</div>
			<ProjectDescription />
			<Tools />
		</div>
	);
};

export default Home;

import React from 'react';
import '../assets/css/homestyle.css';
import Tools from './Tools';
import ProjectDescription from './ProjectDescription';
import Slide from 'react-reveal/Slide';

const Home = () => (
	<div>
		<div id="home">
			<div className="overlay">
				<div className="container">
					<Slide bottom><h1>Build a Voting App</h1></Slide>
				</div>
			</div>
		</div>
		<ProjectDescription />
		<Tools />
	</div>
);

export default Home;

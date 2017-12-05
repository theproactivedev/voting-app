import React from 'react';

const Home = ({ isUserAuthenticated, userName }) => {
	return(
		<div className="container" id="home">
	    <h1>Build a Voting App</h1>
			{isUserAuthenticated &&
				<p>Hello, {userName}</p>
			}
	    <p>Go to the <strong>Polls</strong> page and start voting!</p>
    </div>
	);
}

export default Home;

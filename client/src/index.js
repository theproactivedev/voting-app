import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './containers/App';
//import PollForm from './containers/PollForm'
import registerServiceWorker from './registerServiceWorker';
//
//ReactDOM.render(<App />, document.getElementById('index'));
//ReactDOM.render(<PollForm />, document.getElementById('pollCreation'));


import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
	(
		<BrowserRouter>
			<App />
		</BrowserRouter>
	), 
	document.getElementById('root')
);

registerServiceWorker();

import React, {Component} from 'react';

class Navigation extends Component {
    render() {
        return(
            <nav className="navbar navbar-inverse navbar-fixed-top">
    	      <div className="container">
    	        <div className="navbar-header">
    	          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
    	            <span className="sr-only">Toggle navigation</span>
    	            <span className="icon-bar"></span>
    	            <span className="icon-bar"></span>
    	            <span className="icon-bar"></span>
    	          </button>
    	          <a className="navbar-brand" href="/">FCC Voting App</a>
    	        </div>
    	        <div id="navbar" className="collapse navbar-collapse">
    	          <ul className="nav navbar-nav  navbar-right">
    	            <li><a href="/public/login.html">Log In with Github</a></li>
    	            <li><a href="/public/createPoll.html">Create Poll</a></li>
    	          </ul>
    	        </div>
    	      </div>
    	    </nav>

        );
    }
}

export default Navigation;

import React, { Component } from 'react';
import './App.css';
import Navigation from '../components/Navigation';

class App extends Component {
  constructor() {
    super();
    this.state = {
      polls: []
    };
    this.fetchData = this.fetchData.bind(this);
  }
  
  componentWillMount() {
    this.fetchData();
  }
  
  fetchData() {
    fetch("/")
    .then(function(res) {
      res.json();
    })
    .then(function(items) {
      this.setState({
        polls: items
      });
    });
  }
  
  render() {
		var polls = this.state.polls;
		var listItems = [];
		
		if (polls.length > 0) {
			listItems = this.state.polls.map(function(poll, index) {
				return (
					<li key={index}>poll.question</li>
				);
			});
		}
    
    return(
      <div>
				<header>
					<Navigation />
				</header>
			
        <div>
          {this.state.polls.length === 0 && 
            <p>No questions. Sign in and create your own poll.</p>
          }
        </div>
        <div>
          {
						listItems.length > 0 &&
						<ul>{listItems}</ul>
					}
        </div>
      </div>
    );
  }
}

export default App;

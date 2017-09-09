import React, { Component } from 'react';

class Polls extends Component {
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
		var that = this;
		
    fetch("/")
    .then(function(res) {
      let contentType = res.headers.get('content-type');

			if (contentType.includes('application/json')) {
				return res.json();
			} else{
				throw new Error(`Sorry, content-type ${contentType} not supported`);
			}
		})
    .then(function(items) {
			if (items === undefined) {
				items = [];
 			}
			
      that.setState({
        polls: items
      });
    });
  }
  
  render() {
		var polls = this.state.polls;
		var listItems = [];
//		var container = [];
		
//		if(polls === undefined) {
//			var poll = {
//				question: "No question",
//				options: "No options"
//			};
//			container.push(poll);
//			this.setState({
//				polls: container
//			});
//		}
		
		if (polls.length > 0) {
			listItems = this.state.polls.map(function(poll, index) {
				return (
					<li key={index}>poll.question</li>
				);
			});
		}
    
    return(
      <div className="container">
				<h1>Voting Polls</h1>
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

export default Polls;

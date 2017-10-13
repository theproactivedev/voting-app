import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';

class PollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      choices: [],
      vote: "Select your answer.",
      hasVoted: true
    };

    this.getPoll = this.getPoll.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.handleVoteChange = this.handleVoteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.loadChart = this.loadChart.bind(this);
    this.getColor = this.getColor.bind(this);
    this.checkColors = this.checkColors.bind(this);
  }

  getColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  checkColors(colors, colour) {
    for (var i = 0; i < colors.length; i++) {
      if (colors[i] === colour) {
        return true;
      }
    }
    return false;
  }

  loadChart() {
    var values = [];
    var answers = [];
    // var bgColors = ['#cc0600', '#a32e00', '#c16400', "blue", "green"];
    var bgColors = [];

    var item = this.state.choices;
    for (var i = 0; i < this.state.choices.length; i++) {
      values.push(item[i].vote);
      answers.push(item[i].choice);
      var color = "";
      do {
        color = this.getColor();
      } while (this.checkColors(bgColors, color) === true);
      bgColors.push(color);
    }

    var data = {
      datasets: [{
        label: "Choices",
        backgroundColor: bgColors,
        borderColor: 'white',
        data: values
      }],
      labels: answers
    };

    return data;
  }

  handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject({
        status: res.status,
        statusTxt: res.statusText,
        link: res.url
      });
    }
  }

  handleVoteChange(e) {
    this.setState({
      vote: e.target.value
    });
  }

  handleSubmit(e) {
    console.log(this.state.vote + " - State");
    e.preventDefault();
    if (this.state.vote === "Select your answer.") {
      this.setState({ hasVoted : false });
    } else {
      this.submitVote();
      this.setState({ hasVoted : true });
      this.getPoll();
      this.loadChart();
    }
  }

  submitVote() {
    console.log(this.props.data + " - item");
    var url = this.props.data + "/" + this.props.match.params.item;
    var vote = {
      choice : this.state.vote
    };

    fetch(url,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: "POST",
			body: JSON.stringify(vote)
		})
		.then(this.handleResponse)
		.catch(function(err) {
      console.log("Status on Poll Item: " + err.status + " " + err.statusTxt);
      console.log("Link on Poll Item: " + err.link);
    });

  }

  getPoll() {
    var params = this.props.match.params.item;
    var url = this.props.data + "/" + params;
    var that = this;

    fetch(url)
    .then(this.handleResponse)
    .then(function(item) {
      that.setState({
        query: item.question,
        choices: item.options
      });
    })
    .catch(function(err) {
      console.log("Status: " + err.status + " " + err.statusTxt);
      console.log("Link: " + err.link);
    });

  }

  componentDidMount() {
    this.getPoll();
  }

  render() {
    var options = [];
    options = this.state.choices.map(function(choice, index) {
      return (
        <option key={index+1} value={choice.choice}>{choice.choice}</option>
      );
    });

    return(
      <div className="container">
        {!this.state.hasVoted &&
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6">
              <div className="alert alert-danger">
              <p>Please select your answer.</p>
              </div>
            </div>
          </div>
        }

        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6">
            <form>
              <div className="form-group">
                <label className="question">{this.state.query}</label>
                <p>I would like to vote for: </p>
                <select className="form-control" onChange={this.handleVoteChange}>
                  <option key={0} value="Select your answer.">Select your answer.</option>
                  {options}
                </select>
              </div>
              <div className="form-group">
                <input type="submit" value="Submit" className="btn btn-primary" onClick={this.handleSubmit} />
              </div>
            </form>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-6">
            <Doughnut data={this.loadChart}
            options={{
              title: {
                display: true,
                text: this.state.query,
                position: "bottom"
              },
              animateRotate : true
            }}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default PollItem;

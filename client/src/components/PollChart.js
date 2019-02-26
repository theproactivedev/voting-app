import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

class PollChart extends Component {
  constructor() {
    super();
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

    var item = this.props.options;
    for (var i = 0; i < this.props.options.length; i++) {
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

  render () {
    return(
      <div className="col-sm-12 col-md-8 col-lg-8">
        <Doughnut data={this.loadChart} width={365} height={345}
        options={{
          title: {
            display: true,
            text: this.props.question,
            position: "bottom"
          },
          animateRotate : true,
          responsive: true,
          maintainAspectRatio: false,
        }}
        />
      </div>
    );
  }
}

PollChart.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
};

export default PollChart;

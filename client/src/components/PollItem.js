import React, { Component } from 'react';
import {FormGroup} from 'react-bootstrap';
import {FormControl} from 'react-bootstrap';
import {ControlLabel} from 'react-bootstrap';

class PollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      choices: []
    };

    this.getPoll = this.getPoll.bind(this);
  }

  getPoll() {
    var params = this.props.match.params.item;
    var url = "/polls/" + params;

    var that = this;
    console.log(url);

    fetch(url)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject({
          status: res.status,
          statusTxt: res.statusText,
          link: res.url
        });
      }
    })
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

  componentWillMount() {
    console.log(this.props.match.params.item);
    this.getPoll();
  }

  render() {
    var options = [];
    options = this.state.choices.map(function(choice) {
      return (
        <option value={choice}>{choice}</option>
      );
    });

    return(
      <form>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>{this.state.query}</ControlLabel>
          <FormControl componentClass="select">
            {options}
          </FormControl>
        </FormGroup>
      </form>
    );
  }
}

export default PollItem;

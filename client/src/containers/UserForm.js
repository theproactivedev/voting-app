import React, { Component } from 'react';
import { setUserLocalDetails, setUserToken, toggleLoginModal } from '../actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      email: "",
      password: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    // this.redirect = this.redirect.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    fetch(this.props.data, {
      method: "POST",
      headers: new Headers({
        'Accept': 'application/json',
        'Content-type' : 'application/json'
      }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    })
    .then(response => {
      this.props.storeUserToken(response.headers.get('x-auth-token'));
      return response.json();
    })
    .then(json => this.props.storeUser({user: json}))
    .then(json => this.props.toggleLoginModal(""))
    .then(json => this.setState({ redirect: true }))
    .catch(error => console.error(error));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={{pathname: '/'}} />
    }
    const btnText = this.props.data === "/signup" ? "Sign up" : "Log in";

    return (
      <div className="container">
        <form action="" method="post" onSubmit={this.onSubmit} className="px-0 py-3 py-lg-5">
          <div className="form-group">
            <label>Email</label>
            <input type="text" className="form-control" name="email" value={this.state.email} onChange={this.handleEmailChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </div>

          <button type="submit" className="btn btn-primary">{btnText}</button>
        </form>

        {/* {this.props.data === "/signup" &&
          <a href="/login">Already have an account? Log in here.</a>
        } */}
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    storeUser: (obj) => dispatch(setUserLocalDetails(obj)),
    storeUserToken: (token) => dispatch(setUserToken(token)),
    toggleLoginModal: (path) => dispatch(toggleLoginModal(""))
  }
};

export default connect(null, mapDispatchToProps)(UserForm);
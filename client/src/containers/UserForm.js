import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { submitUserLocalDetails, setErrorMessage } from '../actions';
import DangerError from '../components/DangerError';

class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit() {
    this.props.submitUser({ 
      email: this.state.email, password: this.state.password 
    }, this.props.data); 
  }

  onSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;

    let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{10,}/g;
    if (email !== "" && regex.test(password) && this.props.data === "/signup") {
      this.handleSubmit();
    } else if (email !== "" && password !== "" && this.props.data === "/login") {
      this.handleSubmit();
    } else {
      this.props.setErrorMessage("Please create a stronger password.");
    }
  }

  render() {
    const btnText = this.props.data === "/signup" ? "Sign up" : "Log in";
    const isSignUp = this.props.data === "/signup" ? true : false;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 px-0">
            {this.props.error !== "" &&
              <DangerError msg={this.props.error} />        
            }
            <form action="" method="post" onSubmit={(e) => this.onSubmit(e)} className="px-0 py-3 py-lg-5">
              <div className="form-group">
                <label><strong>Email</strong></label>
                <input type="email" className="form-control" name="email" value={this.state.email} onChange={(e) => this.handleEmailChange(e)} required />
              </div>
              <div className="form-group">
                <label><strong>Password</strong></label>
                {isSignUp &&
                  <p>Please create a password with more than 10 characters, an uppercase and lowercase letters and numbers.</p>
                }
                {isSignUp &&
                  <input type="password" className="form-control" name="password" value={this.state.password} onChange={(e) => this.handlePasswordChange(e)} required pattern=".{10,}" title="Minimum of 10 characters" />
                }
                {!isSignUp &&
                  <input type="password" className="form-control" name="password" value={this.state.password} onChange={(e) => this.handlePasswordChange(e)} required />
                }
              </div>

              <button type="submit" className="btn btn-primary">{btnText}</button>
            </form>
          </div>
          <div className="d-none d-lg-block col-lg-6">
            <p className="signup-brand text-right pl-lg-4">FCC Voting App</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { isUserAuthenticated, error } = state;
  return { isUserAuthenticated, error };
}


const mapDispatchToProps = dispatch => {
  return {
    submitUser: (obj, path) => dispatch(submitUserLocalDetails(obj, path)),
    setErrorMessage: (msg) => dispatch(setErrorMessage(msg))
  }
};

UserForm.propTypes = {
  isUserAuthenticated: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  submitUser: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
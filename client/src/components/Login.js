import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth';
import PropTypes from 'prop-types';

const Login = ({ onSuccess, onFailure, toggleModal }) => {
  return (
    <Nav.Item as="li" key="login" >
      <NavDropdown className="bg-dark text-white" title="Log In" id="login-dropdown">
        <Nav.Link onClick={() => toggleModal("/login")}>Sign in with Email</Nav.Link>
        <Nav.Link eventKey={'/twitter-authenticate'}>
          <TwitterLogin className="twitter-btn p-0 border-0" showIcon={false} loginUrl="https://eg-fcc-votingapp.herokuapp.com/api/v1/auth/twitter"
          onFailure={onFailure} onSuccess={onSuccess}
          requestTokenUrl="https://eg-fcc-votingapp.herokuapp.com/api/v1/auth/twitter/reverse"/>
        </Nav.Link>
      </NavDropdown>
    </Nav.Item>
  )
};

Login.propTypes = {
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  toggleModal: PropTypes.func,
};

export default Login;
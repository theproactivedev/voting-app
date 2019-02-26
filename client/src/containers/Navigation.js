import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth';
import {
  removeUser,
  setUserDetails,
  toggleLoginModal
} from '../actions.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import UserFormModal from '../containers/UserFormModal';

class Navigation extends Component {

  constructor(props) {
    super(props)

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailed = this.onFailed.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this); 
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        if (user.twitterProvider) {
          this.props.dispatch(setUserDetails({
            "userId" : user.twitterProvider.identification,
            "userName" : user.twitterProvider.name,
            "userToken" : token
          }));
        }
      }
    });
  }

  onFailed(error) {
    alert(error);
  }

  logout() {
    this.props.dispatch(removeUser());
    localStorage.removeItem('abcd');
    fetch("/logout").catch(error => console.log(error));
  }

  toggleLoginModal(path) {
    this.props.dispatch(toggleLoginModal(path));
  }

  render() {
    let paths = ["/myPolls", "/newPoll"];
    let pathNames = ["My Polls", "New Poll"];
    let menu = [];

    for(var i = 0; i < pathNames.length; i++) {
      const item = (
        <Nav.Item as="li" key={paths[i]}>
          <LinkContainer to={paths[i]} >
            <Nav.Link>{pathNames[i]}</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      );
      menu.push(item);
    }

		return(
      <div>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>FCC Voting App</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="justify-content-end w-100" as="ul">
                <Nav.Item as="li">
                  <LinkContainer eventKey={'/polls'} to={'/polls'} >
                    <Nav.Link href="/polls">Polls</Nav.Link>
                  </LinkContainer>
                </Nav.Item>

                {this.props.isUserAuthenticated && this.props.user.userName !== "" &&
                  menu
                }

                {this.props.isUserAuthenticated && this.props.user.userName !== "" &&
                  <Nav.Item as="li" key="user" >
                    <NavDropdown title={this.props.user.userName} id="user-dropdown" as="li">
                      <LinkContainer eventKey={'/logout'} to={'/logout'} onClick={this.logout} >
                        <NavDropdown.Item>Log out</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  </Nav.Item>
                }

                {!this.props.isUserAuthenticated &&
                  <Nav.Item as="li" key={'/signup'}>
                    <Nav.Link onClick={() => this.toggleLoginModal("/signup")} >Sign Up</Nav.Link>
                  </Nav.Item>
                }

                {!this.props.isUserAuthenticated &&
                  <Nav.Item as="li" key="login" >
                    <NavDropdown title="Log In" id="login-dropdown">
                      {/* <LinkContainer eventKey={'/login'} to={'/login'} > */}
                        <Nav.Link className="text-dark" onClick={() => this.toggleLoginModal("/login")}>Sign in with Email</Nav.Link>
                      {/* </LinkContainer> */}
                      <Nav.Link eventKey={'/twitter-authenticate'}>
                        <TwitterLogin className="twitter-btn p-0 border-0" showIcon={false} loginUrl="https://eg-fcc-votingapp.herokuapp.com/api/v1/auth/twitter"
                        onFailure={this.onFailed} onSuccess={this.onSuccess}
                        requestTokenUrl="https://eg-fcc-votingapp.herokuapp.com/api/v1/auth/twitter/reverse" />
                      </Nav.Link>
                    </NavDropdown>
                  </Nav.Item>
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <UserFormModal modalObj={{ open: this.props.showLoginModal, path: this.props.loginModalPath }} />
      </div>
      );
  }
}

function mapStateToProps(state) {
  const { isUserAuthenticated, user, showLoginModal, loginModalPath } = state;
  return {
    isUserAuthenticated,
    user, showLoginModal, loginModalPath
  };
}

Navigation.propTypes = {
	isUserAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Navigation);

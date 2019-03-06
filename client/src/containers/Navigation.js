import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { removeUser, setUserTwitterDetails, toggleLoginModal } from '../actions';
import UserFormModal from '../containers/UserFormModal';
import AuthenticatedMenu from '../components/AuthenticatedMenu';


class Navigation extends Component {

  constructor(props) {
    super(props);

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailed = this.onFailed.bind(this);
    this.logout = this.logout.bind(this);
  }

  onSuccess(response) {
    response.json().then(user => {
      if (user.twitterProvider) {
        let userObj = {
          "id" : user.twitter.id,
          "username" : user.twitter.username
        };
        this.props.dispatch(setUserTwitterDetails(userObj));
        localStorage.setItem("abcd",  JSON.stringify({
          isUserAuthenticated: true,
          user: {
            twitter: userObj,
            local: {
              username: "",
              email: ""
            }
          }
        }));
      }
    });
  }

  onFailed(error) {
    // Add a nicer alert here.
    alert(error);
  }

  logout() {
    this.props.dispatch(removeUser());
    localStorage.removeItem('abcd');
    fetch("/logout", {
      method: "GET"
    }).catch(error => console.log(error));
  }

  render() {
    const { isUserAuthenticated, userModal : { showLoginModal, loginModalPath }, user } = this.props;
    let username = user.local.username.length > 0 ? user.local.username : user.twitter.username;

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

                {isUserAuthenticated &&
                  <AuthenticatedMenu />
                }

                {isUserAuthenticated &&
                  <Nav.Item as="li" key={username} >
                    <NavDropdown title={username} id="user-dropdown" as="li">
                      <LinkContainer eventKey={'/logout'} to={'/'} >
                        <NavDropdown.Item onClick={this.logout}>Log out</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  </Nav.Item>
                }

                {!isUserAuthenticated &&
                  <Nav.Item as="li" key={'/signup'}>
                    <Nav.Link onClick={() => this.props.dispatch(toggleLoginModal("/signup")) } >Sign Up</Nav.Link>
                  </Nav.Item>
                }

                {!isUserAuthenticated &&
                  <Nav.Item as="li" key="login" >
                    <NavDropdown className="bg-dark text-white" title="Log In" id="login-dropdown">
                        <Nav.Link onClick={() => this.props.dispatch(toggleLoginModal("/login")) }>Sign in with Email</Nav.Link>
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
        <UserFormModal modalObj={{ open: showLoginModal, path: loginModalPath }} />
      </div>
      );
  }
}

function mapStateToProps(state) {
  const { isUserAuthenticated, user, userModal } = state;
  return {
    isUserAuthenticated,
    user, userModal
  };
}

Navigation.propTypes = {
	isUserAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  userModal: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps)(Navigation));

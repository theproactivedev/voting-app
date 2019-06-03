import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { removeUser, setUserTwitterDetails, toggleLoginModal } from "../actions";
import UserFormModal from "./UserFormModal";
import AuthenticatedMenu from "../components/AuthenticatedMenu";
import DangerError from "../components/DangerError";
import Login from "../components/Login";

class Navigation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeState: false
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleModal = this.toggleModal.bind(this); 
    this.removeActiveNavItem = this.removeActiveNavItem.bind(this); 
  }

  removeActiveNavItem() {
    console.log("Hello");
    this.setState({
      activeState: false
    });
  }

  onSuccess(response) {
    response.json().then(user => {
      if (user.twitter) {
        let userObj = {
          "id" : user.twitter.id,
          "username" : user.twitter.username,
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

  onFailure(error) {
    // Add a nicer alert here.
    alert(error);
  }

  logout() {
    this.props.dispatch(removeUser());
    localStorage.removeItem("abcd");
    fetch("/api/v1/logout").catch(error => console.log(error));
  }

  toggleModal(path) {
    this.props.dispatch(toggleLoginModal(path));
  }

  render() {
    const { isUserAuthenticated, userModal : { showLoginModal, loginModalPath }, user } = this.props;
    let username = user.local.username.length > 0 ? user.local.username : user.twitter.username;
    let loginProps = { 
      onSuccess: this.onSuccess, 
      onFailure: this.onFailure, 
      toggleModal: this.toggleModal 
    };

		return(
      <div>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/" onClick={this.removeActiveNavItem} >
              <Navbar.Brand>FCC Voting App</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="justify-content-end w-100" as="ul">
                <Nav.Item as="li">
                  <LinkContainer eventKey={"/polls"} to={"/polls"} >
                    <Nav.Link active={this.state.activeState} href="/polls">Polls</Nav.Link>
                  </LinkContainer>
                </Nav.Item>

                {isUserAuthenticated &&
                  <AuthenticatedMenu activeState={this.state.activeState} />
                }

                {isUserAuthenticated &&
                  <Nav.Item as="li" key={username} >
                    <NavDropdown title={username} id="user-dropdown" as="li">
                      <LinkContainer eventKey={"/logout"} to={"/"} >
                        <NavDropdown.Item onClick={this.logout}>Log out</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  </Nav.Item>
                }

                {!isUserAuthenticated &&
                  <Nav.Item as="li" key={"/signup"}>
                    <Nav.Link onClick={() => this.toggleModal("/signup") } >Sign Up</Nav.Link>
                  </Nav.Item>
                }

                {!isUserAuthenticated &&
                  <Login {...loginProps} />
                } 
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <UserFormModal modalObj={{ open: showLoginModal, path: loginModalPath }} />
        {this.props.error === "Unauthorized Access. Sign up or log in first." &&
        localStorage.getItem("abcd") !== undefined &&
          <div className="container general">
            <DangerError msg={"Unauthorized Access. Sign up or log in first."} />
          </div>
        }
      </div>
      );
  }
}

function mapStateToProps(state) {
  const { isUserAuthenticated, user, userModal, error } = state;
  return {
    isUserAuthenticated,
    user, userModal, error
  };
}

Navigation.propTypes = {
	isUserAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  userModal: PropTypes.object,
  dispatch: PropTypes.func
};

export default withRouter(connect(mapStateToProps)(Navigation));

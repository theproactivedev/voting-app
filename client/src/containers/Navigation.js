import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth';
import { LinkContainer } from 'react-router-bootstrap';
import {
  removeUser,
  setUserDetails
} from '../actions.js';
import { connect } from 'react-redux';
// import Menu from '../components/Menu.js';

class Navigation extends Component {

  constructor(props) {
    super(props);

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailed = this.onFailed.bind(this);
    this.logout = this.logout.bind(this);
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.props.dispatch(setUserDetails({
          "userId" : user.twitterProvider.identification,
          "userName" : user.twitterProvider.name,
          "userToken" : token
        }));
      }
    });
  }

  onFailed(error) {
    alert(error);
  }

  logout() {
    this.props.dispatch(removeUser());
    localStorage.removeItem('abcd');
  }

  render() {
    let paths = ["/polls", "/myPolls", "/newPoll", "/"];
    let logout = this.props.isUserAuthenticated ? "Log Out" : "";
    let pathNames = ["Polls", "My Polls", "New Poll", logout];
    let menu = [];

    for(var i = 0; i < pathNames.length; i++) {
      if (paths[i] === "/") {
        const item = (
          <LinkContainer to={paths[i]} onClick={this.logout} >
            <NavItem eventKey={paths[i]} href={paths[i]}>{pathNames[i]}</NavItem>
          </LinkContainer>
        );
        menu.push(item);
      } else {
        const item = (
          <LinkContainer to={paths[i]} >
            <NavItem eventKey={paths[i]} href={paths[i]}>{pathNames[i]}</NavItem>
          </LinkContainer>
        );
        menu.push(item);
      }
    }

		return(
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <LinkContainer to="/">
            <Navbar.Brand>FCC Voting App</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>

            {!this.props.isUserAuthenticated &&
              <NavItem eventKey={1}>
                <TwitterLogin className="twitter-btn" showIcon={false} loginUrl="http://localhost:3000/api/v1/auth/twitter"
                onFailure={this.onFailed} onSuccess={this.onSuccess}
                requestTokenUrl="http://localhost:3000/api/v1/auth/twitter/reverse" />
              </NavItem>
            }

            {!!this.props.isUserAuthenticated &&
              menu
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
		);
  }
}

function mapStateToProps(state) {
  const { isUserAuthenticated, user } = state;
  return {
    isUserAuthenticated,
    user
  };
}

export default connect(mapStateToProps)(Navigation);

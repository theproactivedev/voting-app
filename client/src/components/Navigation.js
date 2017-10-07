import React, {Component} from 'react';
import {Navbar} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';
import {NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import TwitterLogin from 'react-twitter-auth';

class Navigation extends Component {

  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      user: null,
      token: ''
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailed = this.onFailed.bind(this);
    this.logout = this.logout.bind(this);
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({
          isAuthenticated: true,
          user: user,
          token: token
        });
      }
    });
  }

  onFailed(error) {
    alert(error);
  }

  logout() {
    this.setState({
      isAuthenticated: false,
      token: '',
      user: null
    });
  }

  render() {
    var paths = ["/myPolls", "/newPoll", "/logout"];
    var logout = "";
    if (this.state.user != null) {
      logout = this.state.user.twitterProvider.name + " Log Out";
    }
    var pathNames = ["My Polls", "New Poll", logout];
    const ifLoggedIn = [];
    var num = 1;
    for(var i = 0; i < 3; i++) {
      ++num;

      if (paths[i] === "/logout") {
        const item = (
          <LinkContainer to={paths[i]} onClick={this.logout}  >
            <NavItem eventKey={num} href={paths[i]}>{pathNames[i]}</NavItem>
          </LinkContainer>
        );
        ifLoggedIn.push(item);
      } else {
        const item = (
          <LinkContainer to={paths[i]}  >
            <NavItem eventKey={num} href={paths[i]}>{pathNames[i]}</NavItem>
          </LinkContainer>
        );
        ifLoggedIn.push(item);
      }
    }

    const navbarInstance = (
			<Navbar inverse collapseOnSelect>
				<Navbar.Header>
          <LinkContainer to="/">
            <Navbar.Brand>FCC Voting App</Navbar.Brand>
          </LinkContainer>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullRight>
            <LinkContainer to="/polls">
							<NavItem eventKey={1} href="/polls">Polls</NavItem>
						</LinkContainer>

            {!this.state.isAuthenticated &&
              <NavItem eventKey={2}>
                <TwitterLogin className="twitter-btn" showIcon={false} loginUrl="http://localhost:3001/api/v1/auth/twitter"
                onFailure={this.onFailed} onSuccess={this.onSuccess}
                requestTokenUrl="http://localhost:3001/api/v1/auth/twitter/reverse" />
              </NavItem>
            }

            {!!this.state.isAuthenticated &&
              ifLoggedIn
            }


					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);

		return(
			<div>
				{navbarInstance}
			</div>
		);
  }
}

export default Navigation;

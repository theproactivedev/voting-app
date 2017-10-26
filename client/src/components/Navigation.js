import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import TwitterLogin from 'react-twitter-auth';


class Navigation extends Component {

  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      author: "",
      identification: "?",
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
        localStorage.setItem("abcd",
          JSON.stringify(
            {
              "identity" : user.twitterProvider.identification,
              "name" : user.twitterProvider.name
            }
          )
        );
        var person = JSON.parse(localStorage['abcd']);
        this.setState({
          isAuthenticated: true,
          author: person.name,
          identification: person.identity,
          token: token
        });
        this.props.onUserLogin(true, person.name, person.identity);
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
      author: "",
      identification: ""
    });
    localStorage.removeItem('abcd');
    this.props.onUserLogout();
  }

  componentWillMount() {
    if (localStorage['abcd'] !== undefined) {
      var person = JSON.parse(localStorage['abcd']);
      this.setState({
        isAuthenticated : true,
        author: person.name,
        identification: person.identity,
      });
    }
  }

  render() {
    var userPolls = "/myPolls/" + this.state.identification;
    var paths = [userPolls, "/newPoll", "/"];
    var logout = "";
    if (this.state.user !== null || this.state.user !== undefined) {
      logout = this.state.author + " Log Out";
    }
    var pathNames = ["My Polls", "New Poll", logout];
    const ifLoggedIn = [];
    var num = 1;
    for(var i = 0; i < pathNames.length; i++) {
      ++num;

      if (paths[i] === "/") {
        const item = (
          <LinkContainer to={paths[i]} onClick={this.logout} >
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
                <TwitterLogin className="twitter-btn" showIcon={false} loginUrl="http://localhost:3000/api/v1/auth/twitter"
                onFailure={this.onFailed} onSuccess={this.onSuccess}
                requestTokenUrl="http://localhost:3000/api/v1/auth/twitter/reverse" />
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

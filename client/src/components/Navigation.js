import React, {Component} from 'react';
import {Navbar} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';
import {NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';


class Navigation extends Component {

  constructor() {
    super();
    this.state = {
      user: "",
      identification: ""
    };

    this.handleResponse = this.handleResponse.bind(this);
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
  }

  componentWillMount() {
    // this.isUserLoggedIn();
  }

  handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject({
        status: res.status,
        statusTxt: res.statusText,
        link: res.url
      });
    }
  }

  isUserLoggedIn() {
    var that = this;

    fetch("/isSomeoneLoggedIn")
    .then(this.handleResponse)
    .then(function(item) {
      that.setState({
        user: item.displayName,
        identification: item.id
      });
    })
    .catch(function(err) {
      console.log("Status: " + err.status + " " + err.statusTxt);
      console.log("Link: " + err.link);
    });
  }

    render() {
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



                {this.state.user !== "" &&
                  <section>
                    <LinkContainer to="/myPolls">
                      <NavItem eventKey={2} href="/myPolls">My Polls</NavItem>
                    </LinkContainer>

                    <LinkContainer to="/newPoll">
                      <NavItem eventKey={3} href="/newPoll">New Poll</NavItem>
                    </LinkContainer>

                    <LinkContainer to="/logout">
                      <NavItem eventKey={4} href="/logout">{this.state.user} Log Out</NavItem>
                    </LinkContainer>
                  </section>
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

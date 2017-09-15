import React, {Component} from 'react';
import {Navbar} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';
import {NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';


class Navigation extends Component {
    render() {
        const navbarInstance = (
					<Navbar inverse collapseOnSelect>
						<Navbar.Header>
              <LinkContainer to="/">
                <Navbar.Brand eventKey={1} href="/public/index.html">FCC Voting App</Navbar.Brand>
              </LinkContainer>
							<Navbar.Toggle />
						</Navbar.Header>
						<Navbar.Collapse>
							<Nav pullRight>
								<LinkContainer to="/">
									<NavItem eventKey={2} href="/public/login.html">Login with Github</NavItem>
								</LinkContainer>
								<LinkContainer to="/public/newPoll">
									<NavItem eventKey={3} href="/public/newPoll.html">Create Poll</NavItem>
								</LinkContainer>
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

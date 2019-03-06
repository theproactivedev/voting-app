import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';

class AuthenticatedMenu extends Component {
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

    return [...menu];
  }
}

export default AuthenticatedMenu;
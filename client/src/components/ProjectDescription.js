import React from 'react';
import { ListGroupItem, ListGroup } from 'react-bootstrap';

const ProjectDescription = () => {
  return (
    <div className="container project-description py-5">
      <h2>Project Description</h2>

      <p className="lead">Here are the specific user stories I should implement for this project.</p>

      <ListGroup>
        <ListGroupItem>As an authenticated user, I can keep my polls and come back later to access them.</ListGroupItem>
        <ListGroupItem>As an authenticated user, I can share my polls with my friends.</ListGroupItem>
        <ListGroupItem>As an authenticated user, I can see the aggregate results of my polls.</ListGroupItem>
        <ListGroupItem>As an authenticated user, I can delete polls that I decide I don&#39;t want anymore.</ListGroupItem>
        <ListGroupItem>As an authenticated user, I can create a poll with any number of possible items.</ListGroupItem>
        <ListGroupItem>As an unauthenticated or authenticated user, I can see and vote on everyone&#39;s polls.</ListGroupItem>
        <ListGroupItem> As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)</ListGroupItem>
        <ListGroupItem>As an authenticated user, if I don&#39;t like the options on a poll, I can create a new option.</ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default ProjectDescription;

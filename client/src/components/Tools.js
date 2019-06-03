import React, { Component } from "react";
import { Image } from "react-bootstrap";
import "../assets/css/homestyle.css";
import react from "../assets/images/react.png";
import redux from "../assets/images/redux.png";
import express from "../assets/images/express.jpg";
import mongoose from "../assets/images/mongoose.png";
import Slide from "react-reveal/Slide";

class Tools extends Component {
  render() {

    let pictures = [react, redux, express, mongoose];
    let images = pictures.map((picture, index) => {
      return <Image key={index} className="image" src={picture} responsive="true" circle="true" />;
    });

    return (
      <div className="tools py-5">
				<div className="container">
          <h2>Tools Used</h2>
					<p className="lead">This is built using Create React App and the following tools:</p>
          <div className="text-center pb-3 pt-lg-3 pb-lg-4">
            <Slide left>
              {images[0]}
              {images[1]}
            </Slide>
            <Slide right>
              {images[2]}
              {images[3]}
            </Slide>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
            <p>This is a full stack JavaScript app where users can log in to share and delete the polls that they made. Users also have the power to create a custom option if they don&#39;t like the options in the poll. And all users can create polls and see the results.</p>
            </div>
            <div className="col-12 col-md-6">
            <p>I used <strong>React</strong>, a JavaScript library, to make it easier to create user interface. I got to reuse parts of the app because of React. And <strong>Redux</strong> has helped me a lot to have a single, organized state which components can access. I used <strong>Express</strong>, a Node.js web application framework, to make it easier for me to handle back end. And I chose <strong>Mongoose</strong>, a mongodb object modeling for Node.js, to handle accessing and storing data to the database.</p>
            </div>

            
            
          </div>
							
        </div>
      </div>
    );
  }
}

export default Tools;

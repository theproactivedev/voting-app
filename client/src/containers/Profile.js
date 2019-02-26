import React, { Component } from 'react';
// import { receiveUserLocalDetails } from '../actions';
// import { connect } from 'react-redux';

class Profile extends Component {
  // componentWillMount() {
  //   console.log("Not working");
  //   this.props.dispatch(receiveUserLocalDetails());
  // }

  render() {
    return (
      <div className="container">
        <h1>Hello User!</h1>
        {this.props.user && this.props.isUserAuthenticated &&
          <p>I'm {this.props.user.userEmail}</p>
        }
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   const { isUserAuthenticated, user } = state;
//   return {
//     isUserAuthenticated, user
//   };
// }

export default Profile;
import React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleLoginModal } from '../actions';
import UserForm from './UserForm';
import PropTypes from 'prop-types';

class UserFormModal extends React.Component {
  render() {
    if (this.props.modalObj.path === "/signup") {
      this.props.history.push("/signup");
    } else if (this.props.modalObj.path === "/login") {
      this.props.history.push("/login");
    } else {
      // this.props.history.push("/");
    }

    return (
      <Modal
        show={this.props.modalObj.open}
        onHide={() => this.props.toggleLoginModal("")}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Fill up the form.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm data={this.props.modalObj.path} />
        </Modal.Body>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleLoginModal : (path) => dispatch(toggleLoginModal(path))
  }
};

UserFormModal.propTypes = {
  history: PropTypes.object.isRequired,
  modalObj: PropTypes.object.isRequired
}

export default withRouter(connect(null, mapDispatchToProps)(UserFormModal));

// export default UserFormM

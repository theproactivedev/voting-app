import React from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toggleLoginModal } from "../actions";
import UserForm from "./UserForm";

class UserFormModal extends React.Component {
  render() {
    const { modalObj } = this.props;
    let title = modalObj.path === "/signup" ? "Sign Up" : "Log In";

    return (
      <Modal
        show={modalObj.open}
        onHide={() => this.props.toggleLoginModal("")}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <div className="user-modal pt-5">
          <div className="container">
          <Modal.Header closeButton className="p-0">
            <Modal.Title id="example-custom-modal-styling-title">
              <h1>{title}</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="container">
              <UserForm data={modalObj.path} />
            </div>
          </Modal.Body>
          </div>
        </div>
        <div className="slanted-div"></div>
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
  modalObj: PropTypes.object,
  toggleLoginModal: PropTypes.func
}

export default connect(null, mapDispatchToProps)(UserFormModal);
